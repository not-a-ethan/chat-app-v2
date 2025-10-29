import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
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
    const newPfp: string = body["pfp"];

    if (newPfp.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a new pfp to edit the current one"
            },
            { status: 400 }
        );
    };

    sql`UPDATE users SET pfp=${newPfp} WHERE githubID=${userId};`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};