import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/apiAuthCheck";
import { getRooms } from "@/helpers/getRooms";

import { ApiAuth } from "@/types";

export async function POST(req: NextRequest) {
    const authStatus: ApiAuth = await apiAuthCheck(req);
    
    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const body = await req.json();
    const messageContent: string = body["content"];
    const roomId: number = body["roomId"];

    if (Number.isNaN(roomId) || roomId == null || roomId == 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid room number"
            },
            { status: 400 }
        );
    };

    if (messageContent.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Your message can not be blank"
            },
            { status: 200 }
        );
    };

    const rooms = await getRooms(authStatus["userId"]);
    
    if (!rooms.includes(roomId.toString())) {
        return NextResponse.json(
            {
                "error": "You cant send a message in a room you are not in"
            },
            { status: 403 }
        );
    };

    try {
        await sql`INSERT INTO messages (roomid, userid, content) VALUES (${roomId}, ${authStatus["userId"]}, ${messageContent});`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong creating message"
            },
            { status: 500 }
        );
    };
    
    return NextResponse.json(
        {},
        { status: 200 }
    );
};