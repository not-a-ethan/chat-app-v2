import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { getRooms } from "../rooms/user/getRooms";
import { updateActvitiy } from "@/helpers/updateActivity";
import { getOwnership } from "@/helpers/roomOwnership";
import { DatabaseMessages } from "@/types";

export async function DELETE(req: NextRequest) {
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
    const messageId = body["messageId"];

    if (messageId == null || Number.isNaN(messageId) || !messageId || messageId == 0) {
        return NextResponse.json(
            {
                "error": "You need a messageId"
            },
            { status: 400 }
        );
    };

    const messageData: DatabaseMessages = await (await sql`SELECT * FROM messages WHERE id=${messageId}`)[0];
    const roomOwnership = await getOwnership(messageData["userid"]);

    if (messageData["userid"] != userId || !roomOwnership.includes(messageData["roomid"])) {
        return NextResponse.json(
            {
                "error": "You do not own that message nor are you the room owner."
            },
            { status: 403 }
        );
    };

    const rooms = await getRooms(userId);

    if (!rooms.includes(messageData["roomid"].toString())) {
        return NextResponse.json(
            {
                "error": "You are not in that room"
            },
            { status: 403 }
        );
    };

    await sql`DELETE FROM messages WHERE userid=${userId} AND roomid=${messageData["roomid"]} AND id=${messageId}`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};