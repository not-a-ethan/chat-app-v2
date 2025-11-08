import { sql } from "@/app/database/db";
import { getRooms } from "@/app/api/rooms/user/getRooms";

import { DatabaseRooms } from "@/types";

export async function getRoomInfo(roomId: number, userId: number): Promise<DatabaseRooms|null> {
    if ((!roomId || Number.isNaN(roomId)) || (!userId || Number.isNaN(userId))) {
        return null;
    };

    const userRooms: string[] = await getRooms(userId);

    if (!userRooms.includes(roomId.toString())) {
        return null;
    };

    const result: DatabaseRooms[] = await sql`SELECT * FROM rooms WHERE id=${roomId};`;

    return result[0];
};