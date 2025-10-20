import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { changeDB, getAll } from "@/database/db";
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

    const query = `INSERT INTO rooms (name, owner) VALUES ($n, ${userId})`;
    changeDB(query, { "$n": name });

    const roomId = await (await getAll(`SELECT seq FROM sqlite_sequence WHERE name='rooms'`, {}))["0"]["seq"];

    addUser(roomId, userId, userId);

    updateActvitiy(userId);

    return NextResponse.json(
        {},
        { status: 200 }
    );
};