import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { getAll } from "@/database/db";
import { DatabaseRooms } from "@/types";
import { updateActvitiy } from "@/helpers/updateActivity";

export async function getRooms(userId: number): Promise<number[]> {
    const roomSQL = await getAll(`SELECT rooms FROM users WHERE githubID=${userId}`, {});

    const rooms: string[]|null = roomSQL[0]["rooms"].split(",");

    if (rooms == null) {
        return [];
    };

    const correctRoomArray = [];

    for (let i = 0; i < rooms.length; i++) {
        correctRoomArray.push(Number(rooms[i]));
    };

    return correctRoomArray;
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

    updateActvitiy(userId);

    const rooms = await getRooms(userId);
    const roomsData: DatabaseRooms[] = [];

    for (let i = 0; i < rooms.length; i++) {
        const thisRoom: DatabaseRooms[] = await getAll(`SELECT * FROM rooms WHERE id=${rooms[i]}`, {});
        roomsData.push(thisRoom[0]);
    };

    return NextResponse.json(
        {
            "rooms": roomsData
        },
        { status: 200 }
    );
};