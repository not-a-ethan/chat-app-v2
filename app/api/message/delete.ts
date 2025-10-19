import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { getAll, changeDB } from "@/database/db";
import { getRooms } from "../rooms/user/getRooms";

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

    const messageData = (await getAll(`SELECT * FROM messages WHERE id=$i`, { "$i": messageId }))[0];

    if (messageData["id"] != userId) {
        return NextResponse.json(
            {
                "error": "You do not own that message"
            },
            { status: 403 }
        );
    };

    const rooms = await getRooms(userId);

    if (!rooms.includes(messageData["roomId"])) {
        return NextResponse.json(
            {
                "error": "You are not in that room"
            },
            { status: 403 }
        );
    };

    const query = `DELETE FROM messages WHERE user=${userId} AND room=$r AND id=$i`;
    changeDB(query, { "$r": messageData["roomId"], "$i": messageId });

    return NextResponse.json(
        {},
        { status: 200 }
    );
};