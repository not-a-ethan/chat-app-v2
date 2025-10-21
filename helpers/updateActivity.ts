import { changeDB } from "@/app/database/db";

export function updateActvitiy(id: number): void {
    const time = Date.now();

    const query = `UPDATE users SET lastActivity=${time} WHERE githubID=${id}`;
    changeDB(query, {});
};