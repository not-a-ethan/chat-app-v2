import { sql } from "@/app/database/db";
import { DatabaseMessages } from "@/types";

export async function getMessageInfo(id: number): Promise<DatabaseMessages|null> {
    if (!id || id <= 0) {
        return null;
    };

    let info: DatabaseMessages[];

    try {
        info = await sql`SELECT * FROM messages WHERE id=${id};`;
    } catch (e) {
        console.error(e);

        return {
            "id": -1,
            "content": "",
            "roomid": -1,
            "userid": -1
        };
    };

    return info[0];
};