import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { getAll } from "@/database/db";

export async function getRooms(userId: number): Promise<number[]> {
    const roomSQL = await getAll(`SELECT rooms FROM users WHERE githubID=${userId}`, {});

    const rooms: number[]|null = roomSQL["rooms"];

    if (rooms == null) {
        return [];
    };

    return rooms;
};            

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

    const rooms = await getRooms(userId);

    return NextResponse.json(
        {
            "rooms": rooms
        },
        { status: 200 }
    );
};