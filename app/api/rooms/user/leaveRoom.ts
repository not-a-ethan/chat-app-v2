import { NextRequest, NextResponse } from "next/server";

import { removeUser } from "../../../../helpers/roomStuff/removeUser";
import { getOwnership } from "@/helpers/roomStuff/roomOwnership";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";

import { ApiAuth } from "@/types";

export async function PUT(req: NextRequest) {
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

    const roomOwner: number[] = await getOwnership(authStatus["userId"])

    if (roomOwner.includes(roomId)) {
        return NextResponse.json(
            {
                "error": "You can not leave a room you own. You must change the ownership then leave"
            },
            { status: 403 }
        );
    };

    const removed = removeUser(roomId, authStatus["userId"]);

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