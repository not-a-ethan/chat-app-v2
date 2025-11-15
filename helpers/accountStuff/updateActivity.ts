import { sql } from "@/app/database/db";

export async function updateActvitiy(id: number): Promise<void> {
    const time: number = Math.floor(Date.now() / 1000);

    await sql`UPDATE users SET lastactivity=${time} WHERE githubid=${id}`;
};