import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseRooms } from "@/types";

export function ListRooms(props: any) {
    const currentRoom: string = props["roomId"];
    const setRoom = props.setRoom;
    const setRoomName = props.setRoomName;
    const setRoomOwner = props.setRoomOwner;
    const setRoomMod = props.setRoomMod;

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
    const ownershipRooms = json["owner"];
    const moderatorRooms = json["mods"];

    if (!rooms || rooms.length === 0) {
        // Cant display rooms that do not exist
        return (<></>);
    } else if (rooms[0] === null) {
        rooms.shift();
    };

    function handleClick(e: any) {
        const id = e.target.id;

        setRoom(id);

        if (ownershipRooms.includes(Number(id))) {
            setRoomOwner(true);
            setRoomMod(true);
        } else if (moderatorRooms.includes(Number(id))) {
            setRoomOwner(false);
            setRoomMod(true);
        } else {
            setRoomOwner(false);
            setRoomMod(false);
        };

        for (let i = 0; i < json["rooms"].length; i++) {
            const currentRoomThing: DatabaseRooms = json["rooms"][i];

            if (currentRoomThing.id == id) {
                setRoomName(currentRoomThing["name"]);
            };
        };
    };

    return (
        <span className={`flex flex-wrap gap-1`}>
            {rooms.map((room: DatabaseRooms) => (
                <Button key={room["id"]} onPress={handleClick} id={room["id"].toString()} color={(room["id"] == Number(currentRoom)) ? "secondary" : "primary"}>
                    {room["name"]}
                </Button>
            ))}
        </span>
    );
};