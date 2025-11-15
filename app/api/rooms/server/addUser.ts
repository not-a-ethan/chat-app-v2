import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { sql } from "@/app/database/db";
import { getRooms } from "../user/getRooms";
import { updateActvitiy } from "@/helpers/updateActivity";
import { getUserId } from "@/helpers/getUserId";

export async function addUser(roomId: string, newUserId: number, addingUserId: number, createRoom: boolean) {
    const adderRooms = await getRooms(addingUserId);

    if (!adderRooms.includes(roomId) && !createRoom) {
        return NextResponse.json(
            {
                "error": "You can not add people to a room you are not in"
            },
            { status: 403 }
        );
    };

    try {
        const currentRoomsSQL: string|null = await (await sql`SELECT rooms FROM users WHERE githubid=${newUserId}`)[0]["rooms"];
        let newRooms: string;

        if (currentRoomsSQL == null) {
            newRooms = `${roomId}`;
        } else {
            const currentRooms = currentRoomsSQL.split(",");
            currentRooms.push(roomId.toString());
            newRooms = currentRooms.join(",");
        };

        await sql`UPDATE users SET rooms=${newRooms} WHERE githubid=${newUserId}`;

        return NextResponse.json(
            {},
            { status: 200 }
        );
    } catch (e) {
        let newRooms: string = `${roomId}`;
        
        try {
            await sql`UPDATE users SET rooms=${newRooms} WHERE githubid=${newUserId}`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong adding user"
                },
                { status: 500 }
            );
        };

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
    const roomId: number = body["room"];
    const username: string = body["username"];

    const newUserId: number = await getUserId(username);

    return addUser(roomId.toString(), newUserId, userId, false);
};