import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { getOwnership } from "@/helpers/roomOwnership";
import { apiAuthCheck } from "@/helpers/apiAuthCheck";
import { getRooms } from "@/helpers/getRooms";

import { DatabaseMessages, ApiAuth } from "@/types";

export async function DELETE(req: NextRequest) {
    const authStatus: ApiAuth = await apiAuthCheck(req);
    
    if (!authStatus) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

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

    let messageData: DatabaseMessages;

    try {
        messageData = await (await sql`SELECT * FROM messages WHERE id=${messageId}`)[0];
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting message data"
            },
            { status: 500 }
        );
    };
    
    const roomOwnership = await getOwnership(messageData["userid"]);

    if (messageData["userid"] != authStatus["userId"] || !roomOwnership.includes(messageData["roomid"])) {
        return NextResponse.json(
            {
                "error": "You do not own that message nor are you the room owner."
            },
            { status: 403 }
        );
    };

    const rooms = await getRooms(authStatus["userId"]);

    if (!rooms.includes(messageData["roomid"].toString())) {
        return NextResponse.json(
            {
                "error": "You are not in that room"
            },
            { status: 403 }
        );
    };

    try {
        await sql`DELETE FROM messages WHERE userid=${authStatus["userId"]} AND roomid=${messageData["roomid"]} AND id=${messageId}`;
    } catch (e) {
        console.error(e);
    
        return NextResponse.json(
            {
                "error": "Something went wrong deleting the message"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};