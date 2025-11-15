import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { DatabaseRooms } from "@/types";
import { getOwnership } from "@/helpers/roomOwnership";
import { apiAuthCheck } from "@/helpers/apiAuthCheck";

import { ApiAuth } from "@/types";

export async function getRooms(userId: number): Promise<string[]> {
    let roomSQL;

    try{
        roomSQL = await sql`SELECT rooms FROM users WHERE githubid=${userId}`;
    } catch (e) {
        console.error(e);

        return [];
    };

    let rooms: string[]|null;

    try {
        rooms = roomSQL[0]["rooms"].split(",");
    } catch (e) {
        return [];
    };
    
    if (rooms == null) {
        return [];
    };

    const correctRoomArray = [];

    for (let i = 0; i < rooms.length; i++) {
        correctRoomArray.push(rooms[i]);
    };

    return correctRoomArray;
};            

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

    // Get rooms
    const rooms = await getRooms(authStatus["userId"]);
    const roomsData: DatabaseRooms[] = [];

    for (let i = 0; i < rooms.length; i++) {
        let thisRoom: DatabaseRooms[];
        
        try {
            thisRoom = await sql`SELECT * FROM rooms WHERE id=${rooms[i]}`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting room data"
                },
                { status: 500 }
            );
        };

        roomsData.push(thisRoom[0]);
    };

    const ids: number[] = await getOwnership(authStatus["userId"]);

    return NextResponse.json(
        {
            "rooms": roomsData,
            "owner": ids
        },
        { status: 200 }
    );
};