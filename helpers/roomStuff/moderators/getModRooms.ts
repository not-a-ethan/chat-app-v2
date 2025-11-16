import { sql } from "@/app/database/db";
import { DatabaseRooms } from "@/types";

export async function getModRooms(userId: number): Promise<string[]> {
    try {
        const roomsData: DatabaseRooms[] = await sql`SELECT * FROM rooms WHERE moderators LIKE ${`&${userId}%`};`;

        const modRooms: string[] = [];

        for (let i = 0; i < roomsData.length; i++) {
            modRooms.push(roomsData[i]["id"].toString());
        };

        return modRooms;
    } catch (e) {
        console.error(e);

        return [];
    };
};