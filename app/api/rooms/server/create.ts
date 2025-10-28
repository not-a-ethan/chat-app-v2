import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { updateActvitiy } from "@/helpers/updateActivity";
import { addUser } from "./addUser";

/*
API docs:

BODY:
"name": string

RESPONSE:
    FAILURE:
    {
        "error": string
    }
    
    SUCCESS:
    status: 200
*/

export async function POST(req: NextRequest) {
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
    const name: string = body["name"];

    if (!name || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a name for the room"
            },
            { status: 400 }
        );
    };

    await sql`INSERT INTO rooms (name, owner) VALUES (${name}, ${userId})`;

    //const roomId = await (sql`SELECT seq FROM sqlite_sequence WHERE name='rooms'`)["0"]["seq"];
    const roomId: number = await (await sql`SELECT id FROM rooms;`)[0]["id"];

    console.log(roomId)

    addUser(roomId, userId, userId, true);

    updateActvitiy(userId);

    return NextResponse.json(
        {},
        { status: 200 }
    );
};