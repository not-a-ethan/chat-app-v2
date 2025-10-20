import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { changeDB } from "@/database/db";

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

    const query = `UPDATE users SET pfp=NULL WHERE githubID=${userId}`;
    changeDB(query, {});

    return NextResponse.json(
        {},
        { status: 200 }
    );
};