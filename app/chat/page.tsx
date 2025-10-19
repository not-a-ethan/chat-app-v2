'use client';

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { Chat } from "./chat";
import { Rooms } from "./rooms";

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
        <>
            <h1>Chat, this heading is temp</h1>

            <Chat roomId={room} />

            <Rooms room={room} setRoom={setRoom} />
        </>
    );
};