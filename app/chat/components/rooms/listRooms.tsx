import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Avatar } from "@heroui/avatar";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseRooms } from "@/types";

import styles from "../../../../styles/chat/components/rooms.module.css";

export function ListRooms(props: any) {
    const currentRoom = props["roomId"];
    const setRoom = props.setRoom;

    const { json, jsonError, jsonLoading } = getAPI("../api/rooms/user", ["json", "jsonError", "jsonLoading"]);

    if (jsonLoading) {
        // Add Skeletons
        return (
            <>
                <p>Loading</p>
            </>
        );
    };

    if (jsonError && jsonError != "true") {
        console.error(jsonError);

        addToast({
            color: "danger",
            title: "Some went wrong getting your rooms",
            description: "More info in the developer console"
        });

        // Skeltons
        return (
            <>
                <p>Error</p>
            </>
        )
    };

    const rooms: DatabaseRooms[] = json["rooms"];

    if (rooms.length === 0) {
        // Cant display rooms that do not exist
        return (<></>);
    } else if (rooms[0] === null) {
        rooms.shift();
    };

    function handleClick(e: any) {
        const id = e.target.id;

        setRoom(id);
    };

    return (
        <span className={`flex flex-wrap gap-1`}>
            {rooms.map((room: DatabaseRooms) => (
                <Button key={room["id"]} onPress={handleClick} id={room["id"].toString()}>
                    {room["name"]}
                </Button>
            ))}
        </span>
    );
};