import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";

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

    await sql`UPDATE users SET pfp=NULL WHERE githubid=${userId}`;

    return NextResponse.json(
        {},
        { status: 200 }
    );
};