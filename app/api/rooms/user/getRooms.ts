import { NextRequest, NextResponse } from "next/server";

import { getAll } from "@/database/db";

export async function getRooms(userId: number): Promise<number[]> {
    const roomSQL = await getAll(`SELECT rooms FROM users WHERE githubID=${userId}`, {});

    const rooms: number[]|null = roomSQL["rooms"];

    if (rooms == null) {
        return [];
    };

    return rooms;
};            
