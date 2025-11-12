import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { updateActvitiy } from "@/helpers/updateActivity";
import { sql } from "@/app/database/db";
import { DatabaseUsers } from "@/types";

export async function GET(req: NextRequest) {
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

    let result: DatabaseUsers;

    try {
        result = (await sql`SELECT * FROM users WHERE githubid=${userId};`)[0];
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting user data"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {
            "data": result
        },
        { status: 200 }
    );
};