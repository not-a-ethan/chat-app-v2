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
    const newName: string = body["name"];

    if (newName.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You cant be nameless"
            },
            { status: 400 }
        );
    };

    const nameExists = await sql`SELECT * FROM users WHERE name=${newName}`;
    
    if (nameExists.length > 0) {
        return NextResponse.json(
            {
                "error": "Your name must be unique"
            },
            { status: 400 }
        );
    };

    sql`UPDATE users SET name=${newName} WHERE githubID=${userId}`;
    
    return NextResponse.json(
        {},
        { status: 200 }
    );
};