'use client';

import { Avatar } from "@heroui/avatar";

import { getAPI } from "@/helpers/getAPI";

import styles from "../../styles/account/header.module.css";

export function Header() {
    const { json, jsonError, jsonLoading } = getAPI("../api/account/info", ["json", "jsonError", "jsonLoading"]);

    if (jsonLoading) {
        return (
            <h1>Hello</h1>
        );
    };

    if (jsonError) {
        return (
            <h1>Hello</h1>
        );
    };

    return (
        <header className={`${styles.grid}`}>
            <h1 className={`${styles.col1} ${styles.welcome}`}>Hello, {json["data"]["name"]}! Welcome to SPACE!</h1>

            <div className={`${styles.col2}`}>
                <Avatar src={json["data"]["pfp"]} alt="Profile Picture" size="lg" />
            </div>
        </header>
    );
};