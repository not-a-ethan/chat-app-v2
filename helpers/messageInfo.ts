import { sql } from "@/app/database/db";
import { DatabaseMessages } from "@/types";

export async function getMessageInfo(id: number): Promise<DatabaseMessages|null> {
    if (!id || id <= 0) {
        return null;
    };

    const info: DatabaseMessages[] = await sql`SELECT * FROM messages WHERE id=${id};`;

    return info[0];
};