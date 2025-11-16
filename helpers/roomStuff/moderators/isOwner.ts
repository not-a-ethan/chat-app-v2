import { sql } from "@/app/database/db";
import { getRooms } from "../getRooms";
import { DatabaseRooms } from "@/types";

export async function isOwner(userId: number, requestingUserId: number, roomId: number): Promise<boolean> {
    const requesterRooms: string[] = await getRooms(requestingUserId);

    if (!requesterRooms.includes(roomId.toString())) {
        return false;
    };

    const roomInfo: DatabaseRooms = await (await sql`SELECT * FROM rooms WHERE id=${roomId};`)[0];

    if (roomInfo["owner"] == userId) {
        return true;
    };

    return false;
};