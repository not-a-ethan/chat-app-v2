import { sql } from "@/app/database/db";
import { AccountExists } from "@/types";

export async function accountExists(id: number, username: string): Promise<AccountExists> {
    const usernameResults = sql`SELECT * FROM users WHERE name=${sql(username)}`;
    const idResults = sql`SELECT * FROM users WHERE githubID=${sql(id)}`;
    const both = sql`SELECT * FROM users WHERE name=${sql(username)} AND githubID=${sql(id)}`;

    return {
        exists: !(both.length === 0),
        idExists: !(idResults.length === 0),
        usernameExists: !(usernameResults.length === 0)
    };
};