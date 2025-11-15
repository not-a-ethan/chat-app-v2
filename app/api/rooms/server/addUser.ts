import { NextRequest, NextResponse } from "next/server";

import { getUserId } from "@/helpers/getUserId";
import { apiAuthCheck } from "@/helpers/apiAuthCheck";
import { addUser } from "@/helpers/addUser";

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
    const roomId: number = body["room"];
    const username: string = body["username"];

    const newUserId: number = await getUserId(username);

    return addUser(roomId.toString(), newUserId, authStatus["userId"], false);
};