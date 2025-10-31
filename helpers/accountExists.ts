import { sql } from "@/app/database/db";
import { AccountExists } from "@/types";

export async function accountExists(id: number, username: string): Promise<AccountExists> {
    const usernameResults: any = await sql`SELECT * FROM users WHERE name=${username};`;
    const idResults: any = await sql`SELECT * FROM users WHERE githubid=${id};`;
    const both: any = await sql`SELECT * FROM users WHERE name=${username} AND githubid=${id};`;
    
    return {
        exists: !(both.length === 0),
        idExists: !(idResults.length === 0),
        usernameExists: !(usernameResults.length === 0)
    };
};