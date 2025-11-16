import { sql } from "@/app/database/db";
import { getRooms } from "./getRooms";
import { isModerator } from "./moderators/isModerator";

export async function removeUser(roomId: number, userId: number): Promise<boolean> {
    const rooms: string[] = await getRooms(userId);

    if (!rooms.includes(roomId.toString())) {
        return false;
    };

    if (await isModerator(userId, roomId, userId)) {
        return false;
    };

    const index = rooms.indexOf(roomId.toString());
    rooms.splice(index, 1);

    try {
        await sql`UPDATE users SET rooms=${rooms} WHERE githubid=${userId};`;
    } catch (e) {
        console.error(e);

        return false;
    };

    return true;
};