import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { getAll, changeDB } from "@/app/database/db";
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

    const nameExists = await getAll(`SELECT * FROM users WHERE name=$n`, { "$n": newName });
    
    if (nameExists.length > 0) {
        return NextResponse.json(
            {
                "error": "Your name must be unique"
            },
            { status: 400 }
        );
    };

    const query = `UPDATE users SET name=$n WHERE githubID=${userId}`;
    changeDB(query, { "$n": newName });

    return NextResponse.json(
        {},
        { status: 200 }
    );
};