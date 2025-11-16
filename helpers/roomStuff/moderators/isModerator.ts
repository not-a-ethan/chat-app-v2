import { getRooms } from "../getRooms";
import { getModerators } from "./getModerators";

export async function isModerator(userId: number, roomId: number, requestingUser: number): Promise<boolean> {
    const rooms: string[] = await getRooms(requestingUser);

    if (!rooms.includes(roomId.toString())) {
        return false;
    };

    const mods: string[] = await getModerators(roomId, userId);

    return mods.includes(userId.toString());
};