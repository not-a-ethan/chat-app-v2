'use client';

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { Chat } from "./chat";
import { Rooms } from "./rooms";

import styles from "../../styles/chat/page.module.css";

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [room, setRoom] = useState(0);

    if (status === "loading") {
        // return elements all with skeletons
    };

    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return( <p>Acess Denied, you need to be loged in to view this page</p>);
    };

    return (
        <div className={`${styles.page}`}>
            <div className={`${styles.main}`}>
                <Chat roomId={room} className={`${styles.chat}`} />

                <div className={`${styles.members}`}>
                    <ul>
                        <li>Person</li>
                        <li>Person</li>
                        <li>Person</li>
                        <li>Person</li>
                    </ul>
                </div>
            </div>
            
            <div className={`${styles.bottom}`}>
                <Rooms room={room} setRoom={setRoom} className={`${styles.rooms}`} />

                <div className={`${styles.managment}`}>hygmk</div>
            </div>
        </div>
    );
};