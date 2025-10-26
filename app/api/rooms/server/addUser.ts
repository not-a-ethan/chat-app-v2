import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { changeDB, getAll } from "@/app/database/db";
import { getRooms } from "../user/getRooms";
import { updateActvitiy } from "@/helpers/updateActivity";

export async function addUser(roomId: number, newUserId: number, addingUserId: number, createRoom: boolean) {
    const adderRooms = await getRooms(newUserId);

    if (!adderRooms.includes(roomId) && !createRoom) {
        return NextResponse.json(
            {
                "error": "You can not add peopel to a room you are not in"
            },
            { status: 403 }
        );
    };

    try {
        const currentRooms: number[]|null = await (await getAll(`SELECT rooms FROM users WHERE githubID=$i`, {"$i": newUserId}))[0]["rooms"].split(",");
        let newRooms: string;

        if (currentRooms == null) {
            newRooms = `${roomId}`;
        } else {
            currentRooms.push(roomId);
            newRooms = currentRooms.join(",");
        };

        
        changeDB(`UPDATE users SET rooms='${newRooms}' WHERE githubID=$u`, { "$u": addingUserId });

        return NextResponse.json(
            {},
            { status: 200 }
        );
    } catch (e) {
        let newRooms: string = `${roomId}`;
        changeDB(`UPDATE users SET rooms=${newRooms} WHERE githubID=$u`, { "$u": addingUserId });

        return NextResponse.json(
            {},
            { status: 200 }
        );
    };
};

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
    const roomId = body["room"];
    const user = body["userId"];

    return addUser(roomId, user, userId, false);
};