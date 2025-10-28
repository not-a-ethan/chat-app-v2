import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

import { getRooms } from "../rooms/user/getRooms";
import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";

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

    const rooms: number[] = await getRooms(userId);

    const currentMessageData = sql`SELECT * from messages WHERE id=${sql(messageId)}`;
    const currentRoomNum = currentMessageData["roomId"];
    const owner = currentMessageData["user"];

    if (owner != userId) {
        return NextResponse.json(
            {
                "error": "You do not own that message"
            },
            { status: 403 }
        );
    };

    if (!rooms.includes(currentRoomNum)) {
        return NextResponse.json(
            {
                "error": "You are no longer in that room"
            },
            { status: 403 }
        );
    };

    sql`UPDATE messages SET content=${sql(newContent)} WHERE id=${sql(messageId)}`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};