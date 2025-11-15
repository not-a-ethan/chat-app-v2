import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/apiAuthCheck";

import { DatabaseUsers, ApiAuth } from "@/types";

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
    const newName: string = body["name"];

    if (newName.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You cant be nameless"
            },
            { status: 400 }
        );
    };

    let nameExists: DatabaseUsers[];

    try {
        nameExists = await sql`SELECT * FROM users WHERE name=${newName}`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting users"
            },
            { status: 500 }
        );
    };
    
    if (nameExists.length > 0) {
        return NextResponse.json(
            {
                "error": "Your name must be unique"
            },
            { status: 400 }
        );
    };

    try {
        await sql`UPDATE users SET name=${newName} WHERE githubid=${authStatus["userId"]}`;
    } catch(e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong changing name"
            },
            { status: 500 }
        );
    };
    
    return NextResponse.json(
        {},
        { status: 200 }
    );
};