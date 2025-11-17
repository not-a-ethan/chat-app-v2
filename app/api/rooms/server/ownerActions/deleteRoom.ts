import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { getRoomInfo } from "@/helpers/roomStuff/roomInfo";
import { removeUser } from "@/helpers/roomStuff/removeUser";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";

import { DatabaseRooms, DatabaseUsers, ApiAuth } from "@/types";

export async function DELETE(req: NextRequest) {
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
    const roomId = body["roomId"];

    if (!roomId || Number.isNaN(roomId)) {
        return NextResponse.json(
            {
                "error": "You need a valid room ID"
            },
            { status: 400 }
        );
    };

    const roomInfo: DatabaseRooms|null = await getRoomInfo(roomId, authStatus["userId"]);

    if (roomInfo == null) {
        return NextResponse.json(
            {
                "error": "Something went wrong getting room info"
            },
            { status: 500 }
        );
    };

    if (roomInfo["owner"] != authStatus["userId"]) {
        return NextResponse.json(
            {
                "error": "You cant delete a room you do not own"
            },
            { status: 403 }
        );
    };

    let people: DatabaseUsers[];

    try {
        people = await sql`SELECT * FROM users WHERE rooms LIKE ${`%${roomId}%`};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting user data"
            },
            { status: 500 }
        );
    };

    for (let i = 0; i < people.length; i++) {
        await removeUser(roomId, authStatus["userId"]);
    };

    try {
        await sql`DELETE FROM messages WHERE roomid=${roomId};`;
        await sql`DELETE FROM rooms WHERE id=${roomId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong deleting messages or room"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};