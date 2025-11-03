'use client';

import { useRef, useEffect } from "react";

import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { getAPI } from "@/helpers/getAPI";

import { EditIcon, DeleteIcon } from "@/components/icons";

import styles from "../../../../styles/chat/components/messages.module.css";

export function Message(props: any) {
    const roomId = props.roomId;
    const userId = props.userId;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (roomId && !(roomId <= 0)) {
            ref.current?.scrollIntoView({
                behavior: "instant",
                block: "end"
            })
        }
    }, [roomId])
    
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
        };
        
        const info: string[] = e.target.id.split(",");
        const type: number = Number(info[0]);
        const messageId: number = Number(info[1]);

        fetch(`../api/message/reactions`, {
            method: "PUT",
            body: JSON.stringify({
                messageId: messageId,
                reaction: type
            })
        });
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
    };

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
        <div className={`${styles.messages}`} id="messages">
            {messages.map((message: any) => (
                <Card key={message["id"]} className={`${styles.message}`}>
                    {message["userid"] == userId ? (
                        <>
                            <div className={`${styles.authorActions}`}>
                                <Button isIconOnly>
                                    <EditIcon />
                                </Button>

                                <Button isIconOnly color="danger">
                                    <DeleteIcon />
                                </Button>
                            </div>
                        </>
                    ) : <></>}

                    <div className={`${styles.cardBody}`}>
                        <div className={`${styles.messageHeader}`}>
                            <Avatar src={users[message["userid"]][0]["pfp"]} />
                            
                            <span>{users[message["userid"]][0]["name"]}</span>
                        </div>

                        <p>{message["content"]}</p>

                        {message["reactionsExists"] ? (
                                <>
                                    <div className={`${styles.reactions}`}>
                                        <Button id={`1,${message.id}`} onPress={react} isIconOnly>👍 {message["reactions"]["1"].length}</Button>

                                        <Button id={`2,${message.id}`} onPress={react} isIconOnly>👎 {message["reactions"]["2"].length}</Button>

                                        <Button id={`3,${message.id}`} onPress={react} isIconOnly>♥️ {message["reactions"]["3"].length}</Button>

                                        <Button id={`4,${message.id}`} onPress={react} isIconOnly>😭 {message["reactions"]["4"].length}</Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`${styles.reactions} ${styles.onHover}`}>
                                        <Button id={`1,${message.id}`} onPress={react} isIconOnly>👍</Button>

                                        <Button id={`2,${message.id}`} onPress={react} isIconOnly>👎</Button>

                                        <Button id={`3,${message.id}`} onPress={react} isIconOnly>♥️</Button>

                                        <Button id={`4,${message.id}`} onPress={react} isIconOnly>😭</Button>
                                    </div>
                                </>
                        )}
                    </div>
                </Card>
            ))}
            <div ref={ref} />
        </div>
    );
};