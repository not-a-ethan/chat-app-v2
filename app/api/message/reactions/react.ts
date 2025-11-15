import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/apiAuthCheck";
import { getMessageInfo } from "@/helpers/messageInfo";
import { sql } from "@/app/database/db";
import { getReactions } from "@/helpers/getReactions";
import { getRooms } from "@/helpers/getRooms";

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

    const body: any = await req.json();
    const messageId: number = body["messageId"];
    const reactionId: number = body["reaction"];
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

    if (!reactionId || (reactionId <= 0 || reactionId >= 5)) {
        return NextResponse.json(
            {
                "error": "You need a valid reaction id"
            },
            { status: 400 }
        );
    };

    const userRooms: string[] = await getRooms(authStatus["userId"]);
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

    const messageReactions = await JSON.parse(await getReactions(authStatus["userId"], messageId));

    if (messageReactions["status"] !== 200) {
        return NextResponse.json(
            {
                "error": "Something went wrong getting reaction data"
            },
            { status: 500 }
        );
    };

    if (messageReactions["reactions"][reactionId.toString()].includes(authStatus["userId"])) {
        // Remove Reaction
        try {
            await sql`DELETE FROM reactions WHERE userid=${authStatus["userId"]} AND reaction=${reactionId} AND messageid=${messageId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong removing reaction"
                },
                { status: 500 }
            );
        };

        return NextResponse.json(
            {
                "type": "delete"
            },
            { status: 200 }
        );
    } else {
        // Adds reaction
        try {
            await sql`INSERT INTO reactions (userid, reaction, messageid) VALUES (${authStatus["userId"]}, ${reactionId}, ${messageId});`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong adding reaction"
                },
                { status: 500 }
            );
        };

        return NextResponse.json(
            {
                "type": "add"
            },
            { status: 200 }
        );
    };
};