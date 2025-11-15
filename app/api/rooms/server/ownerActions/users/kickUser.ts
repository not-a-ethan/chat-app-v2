import { NextRequest, NextResponse } from "next/server";

import { getOwnership } from "@/helpers/roomStuff/roomOwnership";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";

import { removeUser } from "@/helpers/roomStuff/removeUser";
import { getRooms } from "@/helpers/roomStuff/getRooms";

import { ApiAuth } from "@/types";

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
    const kickedUser = body["userId"];
    const roomId = Number(body["roomId"]);

    if  (kickedUser == authStatus["userId"]) {
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

    const rooms = await getOwnership(authStatus["userId"]);

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