import { sql } from "@/app/database/db";

import { DatabaseRooms } from "@/types";

export async function getOwnership(userId: number): Promise<number[]> {
    const results: DatabaseRooms[] = await sql`SELECT * FROM rooms WHERE owner=${userId};`;
    const ids: number[] = [];

    for (let i = 0; i < results.length; i++) {
        ids.push(results[i]["id"]);
    };

    return ids;
};