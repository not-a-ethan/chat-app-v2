import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { updateActvitiy } from "@/helpers/updateActivity";
import { sql } from "@/app/database/db";
import { getRooms } from "../../user/getRooms";
import { getOwnership } from "@/helpers/roomOwnership";

export async function POST(req: NextRequest) {
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

    if (newOwner == userId) {
        return NextResponse.json(
            {
                "error": "You are already the owner"
            },
            { status: 400 }
        );
    };

    const roomOwnerships: number[] = await getOwnership(userId);

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

    await sql`UPDATE rooms SET owner=${newOwner} WHERE id=${roomId};`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};