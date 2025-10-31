import { sql } from "@/app/database/db";

export function updateActvitiy(id: number): void {
    const time: number = Math.floor(Date.now() / 1000);

    sql`UPDATE users SET lastActivity=${time} WHERE githubid=${id}`;
};