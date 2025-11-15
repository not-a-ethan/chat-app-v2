import { NextResponse, NextRequest } from "next/server";

import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";
import { getRooms } from "@/helpers/roomStuff/getRooms";

import { DatabaseMessages, ApiAuth } from "@/types";

export async function PUT(req: NextRequest) {
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

    if (owner != authStatus["userId"]) {
        return NextResponse.json(
            {
                "error": "You do not own that message."
            },
            { status: 403 }
        );
    };

    const rooms: string[] = await getRooms(authStatus["userId"]);

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