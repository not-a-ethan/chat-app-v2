import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";

import { DatabaseMessages, DatabaseUsers } from "@/types";
import { updateActvitiy } from "@/helpers/updateActivity";

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
    const roomId: number = Number(searchParams?.get("roomId"));

    if (roomId <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid room number"
            },
            { status: 400 }
        );
    };
    
    const sqlRooms = await sql`SELECT * FROM users WHERE githubid=${userId}`;
    const rooms: string[] = sqlRooms[0]["rooms"].split(",");

    if (!rooms.includes(roomId.toString())) {
        return NextResponse.json(
            {
                "error": "You are not in that room"
            },
            { status: 403 }
        );
    };

    const messages: DatabaseMessages[] = await sql`SELECT * FROM messages WHERE roomid=${roomId} ORDER BY id DESC LIMIT 50;`;

    interface usersType {
        [index: string]: any
    };

    const users: usersType = {};

    for (let i = 0; i < messages.length; i++) {
        if (users[messages[i]["userid"]]) {
            continue;
        };

        const thisUserData: DatabaseUsers[] = await sql`SELECT * FROM users WHERE githubid=${messages[i]["userid"]}`;

        users[messages[i]["userid"]] = thisUserData;
    };

    return NextResponse.json(
        {
            messages: messages,
            users  : users
        },
        { status: 200 }
    );
};