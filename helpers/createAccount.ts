import { sql } from "@/app/database/db";
import { accountExists } from "./accountExists";
import { AccountExists } from "@/types";

export async function createAccount(id: number, username: string): Promise<boolean> {
    const doesItExist: AccountExists = await accountExists(id, username);

    if (doesItExist["exists"]) {
        return false;
    } else if (doesItExist["idExists"]) {
        return false
    } else if (doesItExist["usernameExists"]) {
        let newUsername = username + Math.floor(Math.random() * 1000).toString();

        while (true) {
            if (await accountExists(id, newUsername)) {
                newUsername = username + Math.floor(Math.random() * 1000).toString();
            } else {
                break;
            };
        };

        const time = Date.now();
        const result = sql`INSERT INTO users (githubID, name, lastActivity) VALUES (${newUsername}, ${id}, ${time});`;
        
        return true;
    };

    const time = Date.now();
    const result = sql`INSERT INTO users (githubID, name, lastActivity) VALUES (${id}, ${username}, ${time});`;

    return true;
};