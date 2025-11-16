import { sql } from "@/app/database/db";
import { getRooms } from "./getRooms";

import { DatabaseRooms } from "@/types";

export async function getRoomInfo(roomId: number, userId: number): Promise<DatabaseRooms|null> {
    if ((!roomId || Number.isNaN(roomId)) || (!userId || Number.isNaN(userId))) {
        return null;
    };

    const userRooms: string[] = await getRooms(userId);

    if (!userRooms.includes(roomId.toString())) {
        return null;
    };

    let result: DatabaseRooms[] = [];

    try {
        result = await sql`SELECT * FROM rooms WHERE id=${roomId};`;
    } catch (e) {
        console.error(e);

        return {
            "id": -1,
            "name": "",
            "owner": -1,
            "moderators": ""
        };
    };

    return result[0];
};