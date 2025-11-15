import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/apiAuthCheck";

import { getReactions } from "./reactions/getReactions";

import { DatabaseMessages, DatabaseUsers, ApiAuth } from "@/types";

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

    const searchParams = req.nextUrl.searchParams;
    const roomId: number = Number(searchParams?.get("roomId"));

    if (roomId <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid room number"
            },
            { status: 400 }
        );
    };

    let sqlRooms: DatabaseUsers[];
    
    try {
        sqlRooms = await sql`SELECT * FROM users WHERE githubid=${authStatus["userId"]}`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting your user data"
            },
            { status: 500 }
        );
    };
    
    const rooms: string[] = sqlRooms[0]["rooms"].split(",");

    if (!rooms.includes(roomId.toString())) {
        return NextResponse.json(
            {
                "error": "You are not in that room"
            },
            { status: 403 }
        );
    };

    let messages: DatabaseMessages[];

    try {
        messages = await sql`SELECT * FROM messages WHERE roomid=${roomId} ORDER BY id ASC LIMIT 50;`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting messages"
            },
            { status: 500 }
        );
    };

    interface usersType {
        [index: string]: any
    };

    const users: usersType = {};

    for (let i = 0; i < messages.length; i++) {
        if (users[messages[i]["userid"]]) {
            continue;
        };

        let thisUserData: DatabaseMessages[];

        try {
            thisUserData = await sql`SELECT * FROM users WHERE githubid=${messages[i]["userid"]}`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting message user data"
                },
                { status: 500 }
            );
        };
        
        users[messages[i]["userid"]] = thisUserData;
    };

    const messagesWithReactions: any[] = messages;

    for (let i = 0; i < messagesWithReactions.length; i++) {
        const messageId = messagesWithReactions[i]["id"];
        const reactions = await JSON.parse(await getReactions(authStatus["userId"], messageId));

        if (reactions["status"] !== 200) {
            // Something went wrong

            messagesWithReactions[i]["reactions"] = { "1": [], "2": [], "3": [], "4": [] };
            continue;
        };

        let reactionsExist = false;

        if (reactions["reactions"]["1"].length !== 0 || reactions["reactions"]["2"].length !== 0 || reactions["reactions"]["3"].length !== 0 || reactions["reactions"]["4"].length !== 0) {
            reactionsExist = true;
        };
        
        messagesWithReactions[i]["reactions"] = reactions["reactions"];
        messagesWithReactions[i]["reactionsExists"] = reactionsExist;
    };

    return NextResponse.json(
        {
            messages: messages,
            users: users
        },
        { status: 200 }
    );
};