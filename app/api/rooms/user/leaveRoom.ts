import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { removeUser } from "../removeUser";
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
    const roomId = body["roomId"];

    const removed = removeUser(roomId, userId);

    if (!removed) {
        return NextResponse.json(
            {
                error: "You are not in that room"
            },
            { status: 400 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};