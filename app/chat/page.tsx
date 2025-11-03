'use client';

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { Chat } from "./chat";
import { Rooms } from "./rooms";
import { ActiveUsers } from "./components/chat/activeUsers";

import styles from "../../styles/chat/page.module.css";

export default function Page() {
    const { data: session, status }: any = useSession();
    const router = useRouter();

    const [room, setRoom] = useState(0);

    try {
        if (status === "loading") {
            // return elements all with skeletons
        };

        if (status === "unauthenticated") {
            router.replace("/api/auth/signin");
            return( <p>Acess Denied, you need to be loged in to view this page</p>);
        };

        const userId = session?.userId;

        return (
            <div className={`${styles.page}`}>
                <div className={`${styles.main}`}>
                    <Chat roomId={room} className={`${styles.chat}`} userId={userId} />

                    <div className={`${styles.members}`}>
                        <ActiveUsers room={room} />
                    </div>
                </div>
                
                <div className={`${styles.bottom}`}>
                    <Rooms room={room} setRoom={setRoom} className={`${styles.rooms}`} />

                    <div className={`${styles.managment}`}></div>
                </div>
            </div>
        );
    } catch (e) {
        router.replace("/api/auth/signin");
        return( <p>Acess Denied, you need to be loged in to view this page</p>);
    };
};