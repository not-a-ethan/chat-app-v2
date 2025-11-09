import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";
import { getRoomInfo } from "@/helpers/roomInfo";
import { DatabaseRooms, DatabaseUsers } from "@/types";
import { removeUser } from "../../removeUser";

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

    updateActvitiy(userId);

    const body = await req.json();
    const roomId = body["roomId"];

    if (!roomId || Number.isNaN(roomId)) {
        return NextResponse.json(
            {
                "error": "You need a valid room ID"
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
                "error": "You cant delete a room you do not own"
            },
            { status: 403 }
        );
    };

    const people: DatabaseUsers[] = await sql`SELECT * FROM users WHERE rooms LIKE ${`%${roomId}%`};`;

    for (let i = 0; i < people.length; i++) {
        await removeUser(roomId, userId);
    };

    const messageRes = await sql`DELETE FROM messages WHERE roomid=${roomId};`;
    const roomRes = await sql`DELETE FROM rooms WHERE id=${roomId};`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};