import { sql } from "@/app/database/db";
import { getRooms } from "../getRooms";
import { DatabaseRooms } from "@/types";

export async function getModerators(roomId: number, userId: number): Promise<string[]> {
    const rooms: string[] = await getRooms(userId);

    // Checks if user is in room
    if (rooms.includes(userId.toString())) {
        return [];
    };

    const roomData: DatabaseRooms = await (await sql`SELECT * FROM rooms WHERE id=${roomId};`)[0];
    const mods: string[] = roomData["moderators"].split(",");

    return mods;
};