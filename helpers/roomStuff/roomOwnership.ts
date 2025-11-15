import { sql } from "@/app/database/db";

import { DatabaseRooms } from "@/types";

export async function getOwnership(userId: number): Promise<number[]> {
    let results: DatabaseRooms[] = [];

    try {
        results = await sql`SELECT * FROM rooms WHERE owner=${userId};`;
    } catch (e) {
        console.error(e);

        return [];
    };
    
    const ids: number[] = [];

    for (let i = 0; i < results.length; i++) {
        ids.push(results[i]["id"]);
    };

    return ids;
};