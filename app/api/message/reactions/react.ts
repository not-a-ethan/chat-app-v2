import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { updateActvitiy } from "@/helpers/updateActivity";
import { getRooms } from "../../rooms/user/getRooms";
import { getMessageInfo } from "@/helpers/messageInfo";
import { sql } from "@/app/database/db";

import { DatabaseMessages } from "@/types";

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

    const body: any = await req.json();
    const messageId: number = body["messageId"];
    const reactionId: number = body["reaction"]
    /*
    1 | thumbs up
    2 | Thumbs down
    3 | heart
    4 | Crying emoji
    */

    if (!messageId || messageId <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid message Id"
            },
            { status: 400 }
        )
    };

    if (!reactionId || !(reactionId <= 0 || reactionId >= 5)) {
        return NextResponse.json(
            {
                "error": "You need a valid reaction id"
            },
            { status: 400 }
        );
    };

    const userRooms: string[] = await getRooms(userId);
    const messageData: DatabaseMessages|null = await getMessageInfo(messageId);

    if (messageData === null) {
        return NextResponse.json(
            {
                "error": "Something went wrong getting message data"
            },
            { status: 500 }
        );
    };

    const messageRoomId: number = messageData["roomid"];

    if (!userRooms.includes(messageRoomId.toString())) {
        return NextResponse.json(
            {
                "error": "You are not in the messages room"
            },
            { status: 403 }
        );
    };

    await sql`INSERT INTO reactions (userid, reaction, messageid) VALUES (${userId}, ${reactionId}, ${messageId});`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};