import { changeDB } from "@/app/database/db";
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
        const query = `INSERT INTO users (githubID, name, lastActivity) VALUES ($u, $i, ${time});`;
        const result = changeDB(query, {"$u": newUsername, "$i": id});
        
        return true;
    };

    const time = Date.now();
    const query = `INSERT INTO users (githubID, name, lastActivity) VALUES ($i, $u, ${time});`;
    const result = changeDB(query, {"$u": username, "$i": id});

    return true;
};