import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { getAll } from "@/database/db";

import { DatabaseMessages, DatabaseUsers } from "@/types";

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

    const searchParams = req.nextUrl.searchParams;
    const roomId: number = Number(searchParams?.get("roomId"));
    
    const sqlRooms = await getAll(`SELECT * FROM users WHERE githubID=${userId}`, {});
    const rooms: number[] = sqlRooms[0]["rooms"].split(",");

    if (!rooms.includes(roomId)) {
        return NextResponse.json(
            {
                "error": "You are not in that room"
            },
            { status: 403 }
        );
    };

    const messages: DatabaseMessages[] = await getAll(`SELECT * FROM messages WHERE roomId=$i ORDER BY id DESC LIMIT 50`, { "$i": roomId });

    interface usersType {
        [index: string]: any
    };

    const users: usersType = {};

    for (let i = 0; i < messages.length; i++) {
        if (users[messages[i]["user"]] == null) {
            continue;
        };

        const thisUserData: DatabaseUsers[] = await getAll(`SELECT * FROM users WHERE githubId=${messages[i]["user"]}`, {});

        if (thisUserData[0]["pfp"] == null) {
            // Set a default pfp for users HERE

            continue;
        };

        users[messages[i]["user"]] = thisUserData[0]["pfp"];
    };

    return NextResponse.json(
        {
            messages: messages,
            users  : users
        },
        { status: 200 }
    );
};