import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { getOwnership } from "@/helpers/roomStuff/roomOwnership";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";
import { getRooms } from "@/helpers/roomStuff/getRooms";

import { ApiAuth } from "@/types";

export async function POST(req: NextRequest) {
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
    const roomId: number = Number(body["roomId"]);
    const newOwner: number = Number(body["userId"]);

    if (!roomId || Number.isNaN(roomId)) {
        return NextResponse.json(
            {
                "error": "You need a valid room Id"
            },
            { status: 400 }
        );
    };

    if (!newOwner || Number.isNaN(newOwner)) {
        return NextResponse.json(
            {
                "error": "You need a valid user Id"
            },
            { status: 400 }
        );
    };

    if (newOwner == authStatus["userId"]) {
        return NextResponse.json(
            {
                "error": "You are already the owner"
            },
            { status: 400 }
        );
    };

    const roomOwnerships: number[] = await getOwnership(authStatus["userId"]);

    if (!roomOwnerships.includes(roomId)) {
        return NextResponse.json(
            {
                "error": "You do not own that room"
            },
            { status: 400 }
        );
    };

    const rooms: string[] = await getRooms(newOwner);

    if (!rooms.includes(roomId.toString())) {
        return NextResponse.json(
            {
                "error": "New owner is not in that room"
            },
            { status: 400 }
        );
    };

    try {
        await sql`UPDATE rooms SET owner=${newOwner} WHERE id=${roomId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "something went wrong changing owner"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};