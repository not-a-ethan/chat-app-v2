'use client';

import { useRef, useEffect } from "react";

import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { getAPI } from "@/helpers/getAPI";

import { EditButton } from "./components/messageActions/editButton";
import { DeleteButton } from "./components/messageActions/deleteButton";

import styles from "../../../../styles/chat/components/messages.module.css";

export function Message(props: any) {
    const roomId = props.roomId;
    const userId = props.userId;
    const roomOwner = props.roomOwner;
    const roomMod = props.roomMod;

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

        let error: boolean = false;

        fetch(`../api/message/reactions`, {
            method: "PUT",
            body: JSON.stringify({
                messageId: messageId,
                reaction: type
            })
        })
        .then(res => {
            if (!res.ok) {
                error = true;
            };

            return res.json();
        })
        .then ((json: any) => {
            if (error) {
                addToast({
                    color: "danger",
                    title: "Could not react to trasmission",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong reacting to trasmission",
                description: "More info in developer console"
            });
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
            title: "Something went wrong getting the trasmissions",
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

    let messages = json["messages"];
    let users = json["users"];

    if (messages.length === 0) {
        return (
            <>
                <p>There are no trasmissions as of now, how about you start the converatation?</p>
            </>
        );
    };

    function updateMessages() {
        let error: boolean = false;

        fetch(`../api/message?roomId=${roomId}`)
        .then(res => {
            if (!res.ok) {
                error = true;
            };

            return res.json();
        })
        .then((json: any) => {
            users = json["users"];
            messages = json["messages"];

            if (error) {
                addToast({
                    color: "danger",
                    title: "Could not get new trasmissions",
                    description: json["error"]
                });
            }
        })
        .catch(e => {
            console.error(e);
            
            addToast({
                title: "Something went wrong",
                description: "Something went wrong getting new trasmissions. More info in developer console",
                color: "danger"
            });
        });
    };

    setInterval(updateMessages, 3000);

    return (
        <section className={`${styles.messages}`} id="messages">
            {messages.map((message: any) => (
                <Card key={message["id"]} className={`${styles.message}`}>
                    {(message["userid"] == userId) ? (
                        <>
                            <div className={`${styles.authorActions}`}>
                                <EditButton id={message["id"]} content={message["content"]} />

                                <DeleteButton id={message["id"]} />
                            </div>
                        </>
                    ) : (roomOwner || roomMod ? (
                        <>
                            <div className={`${styles.authorActions}`}>
                                <DeleteButton id={message["id"]} />
                            </div>
                        </>
                    ) : <></>)}

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
        </section>
    );
};