import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";

import { DatabaseUsers, ApiAuth } from "@/types";
import { getModerators } from "@/helpers/roomStuff/moderators/getModerators";

export async function GET(req: NextRequest) {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const searchParams = req.nextUrl.searchParams;
    const roomId: string|null = searchParams!.get("roomId");

    if (roomId === null || roomId.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a room ID"
            },
            { status: 400 }
        );
    };

    if (isNaN(Number(roomId))) {
        return NextResponse.json(
            {
                "error": "The room ID must be a number"
            },
            { status: 400 }
        );
    };

    if (roomId === "0") {
        return NextResponse.json(
            {
                "error": "You need a valud room ID"
            },
            { status: 400 }
        );
    };

    let people: DatabaseUsers[];

    try {
        people = await sql`SELECT * FROM users WHERE rooms LIKE ${`%${roomId}%`};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting user data"
            },
            { status: 500 }
        );
    };

    const peopleInRoom: DatabaseUsers[] = [];

    for (let i = 0; i < people.length; i++) {
        try {
            if (!people[i]["rooms"]) {
               return NextResponse.json(
                    {
                        "active": [],
                        "other": []
                    },
                    { status: 200 }
                );
            };

            const userRooms: string[] = people[i]["rooms"].split(",");

            if (userRooms.includes(roomId.toString())) {
                peopleInRoom.push(people[i]);
            };
        } catch (e) {
            return NextResponse.json(
                {
                    "active": [],
                    "other": []
                },
                { status: 200 }
            );
        };
    };

    const now: number = Math.floor(Date.now() / 1000);
    const active = peopleInRoom.filter((user: DatabaseUsers) => user.lastactivity >= (now - 300));
    const other = peopleInRoom.filter((user: DatabaseUsers) => user.lastactivity < (now - 300));

    const modIds: string[] = await getModerators(Number(roomId), authStatus["userId"]);
    const mods: DatabaseUsers[] = [];

    for (let i = 0; i < modIds.length; i++) {
        const thisMod: DatabaseUsers = await (await sql`SELECT * FROM users WHERE githubid=${modIds[i]}`)[0];

        mods.push(thisMod);
    };

    return NextResponse.json(
        {
            "active": active,
            "other": other,
            "mods": mods
        },
        { status: 200 }
    );
};