import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/apiAuthCheck";

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
    const newPfp: string = body["pfp"];

    if (newPfp.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a new pfp to edit the current one"
            },
            { status: 400 }
        );
    };

    try {
        await sql`UPDATE users SET pfp=${newPfp} WHERE githubid=${authStatus["userId"]};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong editing pfp"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};