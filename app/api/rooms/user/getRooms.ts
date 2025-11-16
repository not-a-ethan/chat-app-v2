import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { DatabaseRooms } from "@/types";
import { getOwnership } from "@/helpers/roomStuff/roomOwnership";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";
import { getRooms } from "@/helpers/roomStuff/getRooms";

import { ApiAuth } from "@/types";
import { getModRooms } from "@/helpers/roomStuff/moderators/getModRooms";

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

    const ownerRooms: number[] = await getOwnership(authStatus["userId"]);
    const modRooms: string[] = await getModRooms(authStatus["userId"]);

    return NextResponse.json(
        {
            "rooms": roomsData,
            "owner": ownerRooms,
            "mod": modRooms
        },
        { status: 200 }
    );
};