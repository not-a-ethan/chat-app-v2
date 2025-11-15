import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";
import { sql } from "@/app/database/db";
import { ApiAuth, DatabaseUsers } from "@/types";

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

    let result: DatabaseUsers;

    try {
        result = (await sql`SELECT * FROM users WHERE githubid=${authStatus["userId"]};`)[0];
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