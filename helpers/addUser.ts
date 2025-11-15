import { NextResponse } from "next/server";

import { sql } from "@/app/database/db";
import { getRooms } from "./getRooms";

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