import { NextResponse, NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

import { getRooms } from "../rooms/user/getRooms";
import { changeDB, getAll } from "@/database/db";

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

    const body = await req.json();
    const messageId = body["id"];
    const newContent = body["newContent"];

    const rooms: number[] = await getRooms(userId);

    const currentMessageData = await getAll(`SELECT * from messages WHERE id=$i`, { "$i": messageId });
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

    const query = `UPDATE messages SET content=$c WHERE id=$i`;
    changeDB(query, { "$i": messageId, "$c": newContent });

    return NextResponse.json(
        {},
        { status: 200 }
    );
};