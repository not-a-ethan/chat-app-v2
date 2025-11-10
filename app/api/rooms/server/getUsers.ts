import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";

import { DatabaseUsers } from "@/types";

export async function GET(req: NextRequest) {
    const token = await getToken({ req });

    if (!token) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const userId: number = Number(token.sub);

    updateActvitiy(userId);

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

    return NextResponse.json(
        {
            "active": active,
            "other": other
        },
        { status: 200 }
    );
};