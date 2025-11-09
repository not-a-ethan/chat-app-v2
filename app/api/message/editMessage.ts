import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

import { getRooms } from "../rooms/user/getRooms";
import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";
import { getOwnership } from "@/helpers/roomOwnership";

export async function PUT(req: NextRequest) {
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
    const messageId = body["id"];
    const newContent = body["newContent"];

    const currentMessageData = await (await sql`SELECT * from messages WHERE id=${messageId}`)[0];
    const currentRoomNum = currentMessageData["roomid"];
    const owner = currentMessageData["userid"];

    if (owner != userId) {
        return NextResponse.json(
            {
                "error": "You do not own that message."
            },
            { status: 403 }
        );
    };

    const rooms: string[] = await getRooms(userId);

    if (!rooms.includes(currentRoomNum.toString())) {
        return NextResponse.json(
            {
                "error": "You are no longer in that room"
            },
            { status: 403 }
        );
    };

    await sql`UPDATE messages SET content=${newContent} WHERE id=${messageId}`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};