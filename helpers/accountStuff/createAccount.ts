import { sql } from "@/app/database/db";
import { AccountExists } from "@/types";
import { accountExists } from "./accountExists";

export async function createAccount(id: number, username: string): Promise<boolean> {
    const doesItExist: AccountExists = await accountExists(id, username);

    if (doesItExist["exists"]) {
        return false;
    } else if (doesItExist["idExists"]) {
        return false
    } else if (doesItExist["usernameexists"]) {
        let newUsername = username + Math.floor(Math.random() * 1000).toString();

        while (true) {
            if (await accountExists(id, newUsername)) {
                newUsername = username + Math.floor(Math.random() * 1000).toString();
            } else {
                break;
            };
        };

        const time: number = Math.floor(Date.now() / 1000);

        try {
            await sql`INSERT INTO users (githubid, name, lastactivity) VALUES (${newUsername}, ${id}, ${time});`;
        } catch (e) {
            console.error(e);

            return false;
        };

        return true;
    };

    const time: number = Math.floor(Date.now() / 1000);

    try {
        await sql`INSERT INTO users (githubid, name, lastactivity) VALUES (${id}, ${username}, ${time});`;
    } catch (e) {
        console.error(e);

        return false;
    };

    return true;
};