'use client';

import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { getAPI } from "@/helpers/getAPI";

import styles from "../../../../styles/chat/components/messages.module.css";

export function Message(props: any) {
    const roomId = props.roomId;
    const { json, jsonLoading, jsonError } = getAPI(`../api/message?roomId=${roomId}`, ["json", "jsonLoading", "jsonError"]);

    if (roomId < 0) {
        return (
            <></>
        );
    } else if (roomId == 0) {
        return (
            <p>Please select a room on the bottom</p>
        );
    };

    function react(e: any) {
        if (!e) {
            return;
        }
        
        const type = e.target.id;
    };

    if (jsonLoading) {
        // Add Skeltons
        return (
            <>
                <p>Loading</p>
            </>
        )
    };

    if (jsonError && jsonError !== true) {
        console.error(jsonError);
        addToast({
            color: "danger",
            title: "Something went wrong getting the messages",
            description: "More info in developer console"
        });

        // Add more Skeltons
        return (
            <>
                <p>Error</p>
            </>
        )
    };

    if (json == undefined) {
        // Add more Skeltons
        return (
            <>
                <p>Error</p>
            </>
        )
    }

    const messages = json["messages"];
    const users = json["users"];

    if (messages.length === 0) {
        return (
            <>
                <p>There are no messages as of now, how about you start the converatation?</p>
            </>
        );
    };

    return (
        <>
            {messages.map((message: any) => (
                <Card key={message["id"]}>
                    <div className={`${styles.messageHeader}`}>
                        <Avatar src={users[message["userid"]][0]["pfp"]} />
                        
                        <span>{users[message["userid"]][0]["name"]}</span>
                    </div>

                    <p>{message["content"]}</p>
                </Card>
            ))}
        </>
    );
};