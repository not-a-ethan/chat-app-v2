import { NextRequest, NextResponse } from "next/server";


import { sql } from "@/app/database/db";
import { getRoomInfo } from "@/helpers/roomStuff/roomInfo";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";

import { DatabaseRooms, ApiAuth } from "@/types";

export async function PUT(req: NextRequest) {
    const authStatus = await apiAuthCheck(req);
        
    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

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
                "error": "You do not own that room"
            },
            { status: 403 }
        );
    };

    try {
        await sql`UPDATE rooms SET name=${newName} WHERE id=${roomId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong changing room name"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};