import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";
import { getRooms } from "../rooms/user/getRooms";

export async function POST(req: NextRequest) {
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

    const rooms = await getRooms(userId);
    
    if (!rooms.includes(Number(roomId))) {
        return NextResponse.json(
            {
                "error": "You cant send a message in a room you are not in"
            },
            { status: 403 }
        );
    };

    await sql`INSERT INTO messages (roomid, userid, content) VALUES (${roomId}, ${userId}, ${messageContent});`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};