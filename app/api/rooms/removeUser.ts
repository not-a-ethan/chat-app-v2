import { sql } from "@/app/database/db";
import { getRooms } from "./user/getRooms";

export async function removeUser(roomId: number, userId: number): Promise<boolean> {
    const rooms: number[] = await getRooms(userId);

    if (!rooms.includes(roomId)) {
        return false;
    };

    const index = rooms.indexOf(roomId);
    rooms.splice(index, 1);

    sql`UPDATE users SET rooms=${rooms} WHERE githubID=${userId}`;

    return true;
};