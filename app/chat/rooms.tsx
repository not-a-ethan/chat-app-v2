'use client';

import { Button } from "@heroui/button";

import { ListRooms } from "./components/rooms/listRooms";
import { CreateRoom } from "./components/rooms/createRoom";
import { ThemeSwitch } from "@/components/theme-switch";

import { GearIcon } from "@/components/icons";

import styles from "../../styles/chat/components/rooms.module.css";

export function Rooms(props: any) {
    const room = props["room"];
    const setRoom = props.setRoom;

    const pfp: string = "";

    return (
        <span className={`flex flex-wrap gap-2 ${styles.body}`}>
            <ListRooms roomId={room} setRoom={setRoom} />
            <CreateRoom />

            <div className={`${styles.settings}`}>
                <ThemeSwitch />
                <Button onPress={e => location.href='../account'}>
                    <GearIcon />
                </Button>
            </div>
        </span>
    );
};