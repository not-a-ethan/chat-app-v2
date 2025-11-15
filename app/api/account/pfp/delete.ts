import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";

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

    try {
        await sql`UPDATE users SET pfp=NULL WHERE githubid=${authStatus["userId"]};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong deleting pfp"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};