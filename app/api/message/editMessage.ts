import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

import { getRooms } from "../rooms/user/getRooms";
import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";
import { getOwnership } from "@/helpers/roomOwnership";
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

    const body = await req.json();
    const messageId = body["id"];
    const newContent = body["newContent"];

    let currentMessageData: DatabaseMessages;

    try {
        currentMessageData = await (await sql`SELECT * from messages WHERE id=${messageId}`)[0];
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting message info"
            },
            { status: 500 }
        );
    };

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

    try {
        await sql`UPDATE messages SET content=${newContent} WHERE id=${messageId}`;
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong editing the message"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};