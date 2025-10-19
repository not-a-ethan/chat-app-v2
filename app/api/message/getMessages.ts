import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { getAll } from "@/database/db";

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

    const sqlMessages = await getAll(`SELECT * FROM messages WHERE roomId=$i ORDER BY id DESC LIMIT 50`, { "$i": roomId });
    const messages = sqlMessages[0];

    return NextResponse.json(
        {
            messages: messages
        },
        { status: 200 }
    );
};