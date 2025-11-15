import { sql } from "@/app/database/db";

export async function getRooms(userId: number): Promise<string[]> {
    let roomSQL;

    try{
        roomSQL = await sql`SELECT rooms FROM users WHERE githubid=${userId}`;
    } catch (e) {
        console.error(e);

        return [];
    };

    let rooms: string[]|null;

    try {
        rooms = roomSQL[0]["rooms"].split(",");
    } catch (e) {
        return [];
    };
    
    if (rooms == null) {
        return [];
    };

    const correctRoomArray = [];

    for (let i = 0; i < rooms.length; i++) {
        correctRoomArray.push(rooms[i]);
    };

    return correctRoomArray;
};  