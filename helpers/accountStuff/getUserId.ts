import { sql } from "@/app/database/db";

export async function getUserId(username: string): Promise<number> {
    if (!username || username.trim().length === 0) {
        return -1;
    };

    let result;

    try {
        result = await sql`SELECT githubid FROM users WHERE name=${username}`;
    } catch (e) {
        console.error(e);

        return -1;
    };
    

    const id = result[0]["githubid"];

    if (!id) {
        return -1;
    };

    return id;
};