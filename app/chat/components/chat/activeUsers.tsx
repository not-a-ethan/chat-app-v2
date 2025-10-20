import { Avatar } from "@heroui/avatar";
import { Listbox, ListboxSection, ListboxItem } from "@heroui/listbox";
import { addToast } from "@heroui/toast";

import { getAPI } from "@/helpers/getAPI";
import { DatabaseUsers } from "@/types";

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

    const people: DatabaseUsers[] = json["people"];

    return (
        <Listbox classNames={{
                base: "max-w-xs",
                list: "max-h-[300px] overflow-scroll",
            }}
            items={people}
        >
            {people.map((person) => (
                <ListboxItem key={person.githubId} textValue={person.name}>
                    <div className="flex gap-2 items-center">
                    <Avatar alt={person.name} className="shrink-0" size="sm" src={person.pfp || ""} />
                    <div className="flex flex-col">
                        <span className="text-small">{person.name}</span>
                    </div>
                    </div>
                </ListboxItem>
            ))}
        </Listbox>
    );
};