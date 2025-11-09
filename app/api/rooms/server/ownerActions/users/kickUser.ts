import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { updateActvitiy } from "@/helpers/updateActivity";
import { getOwnership } from "@/helpers/roomOwnership";

import { getRooms } from "../../../user/getRooms";
import { removeUser } from "../../../removeUser";

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
    const kickedUser = body["userId"];
    const roomId = Number(body["roomId"]);

    if  (kickedUser == userId) {
        return NextResponse.json(
            {
                "error": "You can not kick yourself, change the owner and leave instead"
            },
            { status: 403 }
        );
    };

    if (!kickedUser || Number.isNaN(kickedUser)) {
        return NextResponse.json(
            {
                "error": "You need a valid user id"
            },
            { status: 400 }
        );
    };

    if (!roomId || Number.isNaN(roomId)) {
        return NextResponse.json(
            {
                "error": "You ened a valid room id"
            },
            { status: 400 }
        );
    };

    const rooms = await getOwnership(userId);

    if (!rooms.includes(roomId)) {
        return NextResponse.json(
            {
                "error": "You do not own that room"
            },
            { status: 403 }
        );
    };
    
    const kickRooms = await getRooms(kickedUser);

    if (!kickRooms.includes(roomId.toString())) {
        return NextResponse.json(
            {
                "error": "The user is not in that room"
            },
            { status: 400 }
        );
    };

    const res = await removeUser(roomId, kickedUser);

    if (!res) {
        return NextResponse.json(
            {
                "error": "Something went wrong removing user"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};