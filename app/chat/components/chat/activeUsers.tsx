import { Avatar } from "@heroui/avatar";
import { Listbox, ListboxSection, ListboxItem } from "@heroui/listbox";
import { addToast } from "@heroui/toast";

import { getAPI } from "@/helpers/getAPI";

export function ActiveUsers(props: any) {
    const roomID = props.room;

    const { json, jsonError, jsonLoading } = getAPI(`../api/rooms/server?roomId=${roomID}`, ["json", "jsonError", "jsonLoading"]);

    if (jsonLoading) {
        // Spooky Scary Skeltons
        return (
            <>
                <p>Loading</p>
            </>
        );
    };

    if (jsonError) {
        if (json !== true) {
            addToast({
                color: "danger",
                title: "Something went wrong geting active users",
                description: "Mroe info in developer console"
            });
        };
    };

    return (
        <>
            <p>Hello there</p>
        </>
    );
};