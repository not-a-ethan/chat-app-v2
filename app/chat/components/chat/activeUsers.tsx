import { Avatar } from "@heroui/avatar";
import { Listbox, ListboxSection, ListboxItem } from "@heroui/listbox";
import { addToast } from "@heroui/toast";

import { getAPI } from "@/helpers/getAPI";

import { LeaveRoom } from "./components/roomActions/leaveRoom";
import { RenameRoom } from "./components/roomActions/renameRoom";
import { DeleteRoom } from "./components/roomActions/deleteRoom";

import { AddMember } from "./components/messageActions/addUser";
import { RemoveUser } from "./components/roomActions/removeUser";
import { ChangeOwner } from "./components/roomActions/changeOwner";

import { DatabaseUsers } from "@/types";

export function ActiveUsers(props: any) {
    const roomID = props.room;
    const currentName = props.roomName;
    const owners: number[] = props.owners;

    const { json, jsonError, jsonLoading } = getAPI(`../api/rooms/server?roomId=${roomID}`, ["json", "jsonError", "jsonLoading"]);

    if (roomID <= 0) {
        return (
            <>
            </>
        );
    };

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
                description: "More info in developer console"
            });
        };
    };

    const active: DatabaseUsers[] = json["active"];
    const other: DatabaseUsers[] = json["other"];

    return (
        <section>
            <Listbox classNames={{base: "max-w-xs",list: `overflow-scroll`}} selectionMode="none">
                <ListboxSection>
                    {active.map((person) => (
                        <ListboxItem key={person.githubid} textValue={person.name}>
                            <div className="flex gap-2 items-center">
                            <Avatar alt={person.name} className="shrink-0" size="sm" src={person.pfp || ""} />
                            <div className="flex flex-col">
                                <span className="text-small">{person.name}</span>
                            </div>
                            </div>
                        </ListboxItem>
                    ))}
                </ListboxSection>

                {other.length === 0 ? <></> : (
                    <ListboxSection title="Inactive">
                        {other.map((person) => (
                            <ListboxItem key={person.githubid} textValue={person.name}>
                                <div className="flex gap-2 items-center">
                                <Avatar alt={person.name} className="shrink-0" size="sm" src={person.pfp || ""} />
                                <div className="flex flex-col">
                                    <span className="text-small">{person.name}</span>
                                </div>
                                </div>
                            </ListboxItem>
                        ))}
                    </ListboxSection>
                )}

                <ListboxSection title="Actions">
                    {!owners ? (
                        <>
                            <ListboxItem textValue="">
                                <LeaveRoom room={roomID} />
                            </ListboxItem>
                        </>
                    ) : <></>}

                    <ListboxItem>
                        <AddMember roomID={roomID} />
                    </ListboxItem>

                    {owners ? (
                        <>
                            <ListboxItem textValue="">
                                <RenameRoom roomId={roomID} currentName={currentName} />
                            </ListboxItem>

                            <ListboxItem textValue="">
                                <DeleteRoom roomId={roomID} />
                            </ListboxItem>

                            <ListboxItem textValue="">
                                <RemoveUser roomId={roomID} people={active.concat(other)} />
                            </ListboxItem>

                            <ListboxItem textValue="">
                                <ChangeOwner roomId={roomID} people={active.concat(other)} />
                            </ListboxItem>
                        </>
                    ) : <></>}
                </ListboxSection>
            </Listbox>
        </section>
    );
};