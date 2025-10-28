import { sql } from "@/app/database/db";

export function updateActvitiy(id: number): void {
    const time = Date.now();

    sql`UPDATE users SET lastActivity=${time} WHERE githubID=${id}`;
};