import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/apiAuthCheck";
import { getReactions } from "@/helpers/getReactions";

import { DatabaseMessages, DatabaseReactions, MessageReactions, ApiAuth } from "@/types";

export async function GET(req: NextRequest) {
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
    const messageId: number = body["messageId"];

    const res = await JSON.parse(await getReactions(authStatus["userId"], messageId));

    if (res["status"] !== 200) {
        return NextResponse.json(
            {
                "error": res["error"]
            },
            { status: res["status"] }
        );
    };

    return NextResponse.json(
        {
            "reactions": res["reactions"]
        },
        { status: 200 }
    );
};