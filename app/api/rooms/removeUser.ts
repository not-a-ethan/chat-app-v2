import { sql } from "@/app/database/db";
import { getRooms } from "./user/getRooms";

export async function removeUser(roomId: number, userId: number): Promise<boolean> {
    const rooms: string[] = await getRooms(userId);

    if (!rooms.includes(roomId.toString())) {
        return false;
    };

    const index = rooms.indexOf(roomId.toString());
    rooms.splice(index, 1);

    await sql`UPDATE users SET rooms=${rooms} WHERE githubid=${userId}`;

    return true;
};