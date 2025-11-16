import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { isOwner } from "@/helpers/roomStuff/moderators/isOwner";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";
import { getRooms } from "@/helpers/roomStuff/getRooms";
import { isModerator } from "@/helpers/roomStuff/moderators/isModerator";

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
    
    const owner: boolean = await isOwner(authStatus["userId"], authStatus["userId"], messageData["roomid"]);
    const roomModerator: boolean = await isModerator(authStatus["userId"], messageData["roomid"], authStatus["userId"]);

    if (messageData["userid"] != authStatus["userId"] && !owner && !roomModerator) {
        return NextResponse.json(
            {
                "error": "You do not own that message nor are you the room owner nor are you a room moderator."
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
        await sql`DELETE FROM messages WHERE userid=${messageData["userid"]} AND roomid=${messageData["roomid"]} AND id=${messageId}`;
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