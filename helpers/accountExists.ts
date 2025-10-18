import { getAll } from "@/database/db";
import { AccountExists } from "@/types";

export async function accountExists(id: number, username: string): Promise<AccountExists> {
    const usernameResults = await getAll(`SELECT * FROM users WHERE name=$u`, {"$u": username});
    const idResults = await getAll(`SELECT * FROM users WHERE githubID=$i`, {"$i": id});
    const both = await getAll(`SELECT * FROM users WHERE name=$u AND githubID=$i`, {"$u": username, "$i": id});

    return {
        exists: !(both.length === 0),
        idExists: !(idResults.length === 0),
        usernameExists: !(usernameResults.length === 0)
    };
};