import { NextRequest, NextResponse } from "next/server";

import { isOwner } from "@/helpers/roomStuff/moderators/isOwner";
import { sql } from "@/app/database/db";
import { apiAuthCheck } from "@/helpers/accountStuff/apiAuthCheck";
import { getRooms } from "@/helpers/roomStuff/getRooms";

import { ApiAuth } from "@/types";
import { getModerators } from "@/helpers/roomStuff/moderators/getModerators";
import { isModerator } from "@/helpers/roomStuff/moderators/isModerator";

export async function DELETE(req: NextRequest) {
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

    if ((!modsId || Number.isNaN(modsId)) && modsId != undefined) {
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

    if (await isOwner(authStatus["userId"], authStatus["userId"], roomId)) {
        // Nothing happens as user is already the owner
    } else if ((await isModerator(modsId, roomId, authStatus["userId"]) && modsId == authStatus["userId"]) || modsId == undefined) {
        // Mod will remove their own moderator

        const modList: string[] = await getModerators(roomId, authStatus["userId"]);
        modList.splice(modList.indexOf(authStatus["userId"].toString()), 1);
        
        try {
            await sql`UPDATE rooms SET moderators=${modList} WHERE id=${roomId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong updating mods"
                },
                { status: 500 }
            );
        };

        return NextResponse.json(
            {},
            { status: 200 }
        );
    } else if ((await isModerator(modsId, roomId, authStatus["userId"])) && modsId != authStatus["userId"]) {
        return NextResponse.json(
            {
                "error": "You can not remove another moderators, moderation powers"
            },
            { status: 403 }
        );
    } else {
        return NextResponse.json(
            {
                "error": "You are not the owner nor a moderator of the room"
            },
            { status: 403 }
        );
    };

    const modRooms: string[] = await getRooms(modsId);

    if (!modRooms.includes(roomId.toString())) {
        return NextResponse.json(
            {
                "error": "User is not in the room"
            },
            { status: 400 }
        );
    };

    const modList: string[] = await getModerators(roomId, authStatus["userId"]);
    modList.splice(modList.indexOf(modsId.toString()), 1);

    try {
        await sql`UPDATE rooms SET moderators=${modList.join(",")} WHERE id=${roomId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong updating mods"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};