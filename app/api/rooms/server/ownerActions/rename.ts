import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";
import { getRoomInfo } from "@/helpers/roomInfo";
import { DatabaseRooms } from "@/types";

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
    const roomId = Number(body["id"]);
    const newName = body["newName"];

    if (!roomId || Number.isNaN(roomId)) {
        return NextResponse.json(
            {
                "error": "You need a valid room ID"
            },
            { status: 400 }
        );
    };

    if (!newName || newName.trim().length == 0) {
        return NextResponse.json(
            {
                "error": "You need a valud room name"
            },
            { status: 400 }
        );
    };

    const roomInfo: DatabaseRooms|null = await getRoomInfo(roomId, userId);

    if (roomInfo == null) {
        return NextResponse.json(
            {
                "error": "Something went wrong getting room info"
            },
            { status: 500 }
        );
    };

    if (roomInfo["owner"] != userId) {
        return NextResponse.json(
            {
                "error": "You do not own that room"
            },
            { status: 403 }
        );
    };

    await sql`UPDATE rooms SET name=${newName} WHERE id=${roomId};`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};