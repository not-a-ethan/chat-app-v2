import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { changeDB } from "@/app/database/db";
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

    const query = `UPDATE users SET pfp=$p WHERE githubID=${userId};`;
    changeDB(query, { "$p": newPfp });

    return NextResponse.json(
        {},
        { status: 200 }
    );
};