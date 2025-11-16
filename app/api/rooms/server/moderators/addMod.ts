import { NextRequest, NextResponse } from "next/server";

import { isOwner } from "@/helpers/roomStuff/moderators/isOwner";
import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";
import { getRooms } from "@/helpers/roomStuff/getRooms";
import { getModerators } from "@/helpers/roomStuff/moderators/getModerators";

import { ApiAuth } from "@/types";

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
    const roomId: number = body["roomId"];
    const modsId: number = body["modId"];

    if (!roomId || Number.isNaN(roomId)) {
        return NextResponse.json(
            {
                "error": "You need a valid room number"
            },
            { status: 400 }
        );
    };

    if (!modsId || Number.isNaN(modsId)) {
        return NextResponse.json(
            {
                "error": "You need a valid mod id"
            },
            { status: 400 }
        );
    };

    if (modsId == authStatus["userId"]) {
        return NextResponse.json(
            {
                "error": "You are the owner of the room"
            },
            { status: 400 }
        );
    };

    if (!(await isOwner(authStatus["userId"], authStatus["userId"], roomId))) {
        return NextResponse.json(
            {
                "error": "You are not the owner of that room"
            },
            { status: 403 }
        );
    };

    const modRooms: string[] = await getRooms(modsId);

    if (!modRooms.includes(roomId.toString())) {
        return NextResponse.json(
            {
                "error": "Mod is not in that room"
            },
            { status: 400 }
        );
    };

    const roomMods: string[] = await getModerators(roomId, modsId);

    if (roomMods.includes(modsId.toString())) {
        return NextResponse.json(
            {
                "error": "That user is already a mod"
            },
            { status: 409 }
        );
    };

    const newMods: string[] = roomMods.concat(modsId.toString());

    try {
        await sql`UPDATE rooms SET moderators=${newMods} WHERE id=${roomId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong updated mods"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};