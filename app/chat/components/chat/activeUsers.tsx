import { Avatar } from "@heroui/avatar";
import { Listbox, ListboxSection, ListboxItem } from "@heroui/listbox";
import { addToast } from "@heroui/toast";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { getAPI } from "@/helpers/getAPI";
import { LeaveRoom } from "./components/leaveRoom";

import { DatabaseUsers } from "@/types";

export function ActiveUsers(props: any) {
    const roomID = props.room;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                description: "Mroe info in developer console"
            });
        };
    };

    function addUser(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const username: string = data["username"].toString();

        fetch("../api/rooms/server", {
            method: "PUT",
            body: JSON.stringify({
                "room": roomID,
                "username": username
            })
        })
    };

    const people: DatabaseUsers[] = json["people"];

    return (
        <>
            <Listbox classNames={{
                    base: "max-w-xs",
                    list: "max-h-[300px] overflow-scroll",
                }}
                items={people}
            >
                <ListboxSection>
                    {people.map((person) => (
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
                
                <ListboxSection title="Actions">
                    <ListboxItem textValue="Add New Member" onPress={onOpen}>
                        <div className="flex gap-2 items-center">
                            <p>Add new member</p>
                        </div>
                    </ListboxItem>

                    <ListboxItem textValue="">
                        <LeaveRoom room={roomID} />
                    </ListboxItem>
                </ListboxSection>
            </Listbox>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>
                                <h2>Add user</h2>
                            </ModalHeader>

                            <ModalBody>
                                <Form onSubmit={addUser}>
                                    <Input label="Username" name="username" />

                                    <Button onPress={onclose} type="submit">Add User</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};