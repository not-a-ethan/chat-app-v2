import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { updateActvitiy } from "@/helpers/updateActivity";
import { sql } from "@/app/database/db";
import { getRooms } from "../../rooms/user/getRooms";
import { getMessageInfo } from "@/helpers/messageInfo";
import { DatabaseMessages, DatabaseReactions, MessageReactions } from "@/types";

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

    const body = await req.json();
    const messageId: number = body["messageId"];

    if (!messageId || messageId <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid message Id"
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

    const result: DatabaseReactions[] = await sql`SELECT * FROM reactions WHERE messageid=${messageId}`;

    const reactions: MessageReactions = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    for (let i = 0; i < result.length; i++) {
        const thisReaction: DatabaseReactions = result[i];
        const reactionType: number = thisReaction["reaction"];

        reactions[reactionType as keyof typeof reactions].push(thisReaction["userid"]);
    };

    return NextResponse.json(
        {
            "reactions": reactions
        },
        { status: 200 }
    );
};