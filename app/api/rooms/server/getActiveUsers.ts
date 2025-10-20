import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { getAll } from "@/database/db";
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

    // Selects all users that were active in the past 5 min, in said room
    const now = Date.now();
    //const query = `SELECT * FROM users WHERE rooms LIKE CONCAT('%,', $room, ',%') AND lastActivity > ${now-300000}`;
    const query = `SELECT * FROM users WHERE lastActivity > ${now-300000};`
    const people: DatabaseUsers[] = await getAll(query, {});

    const peopleInRoom: DatabaseUsers[] = [];

    for (let i = 0; i < people.length; i++) {
        const userRooms: string[] = people[i]["rooms"].split(",");

        if (userRooms.includes(roomId.toString())) {
            peopleInRoom.push(people[i]);
        };
    };

    return NextResponse.json(
        {
            "people": peopleInRoom
        },
        { status: 200 }
    );
};