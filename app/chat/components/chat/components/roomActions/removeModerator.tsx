'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

import { DatabaseUsers } from "@/types";

export function RemoveMod(props: any) {
    const roomId = props.roomId;
    const mods: DatabaseUsers[] = props.people;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleSubmit(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const userId: number = Number(data["user"].toString());

        let error: boolean = false;
        
        fetch("../api/rooms/server/moderators", {
            method: "DELETE",
            body: JSON.stringify({
                "roomId": Number(roomId),
                "modId": Number(userId)
            })
        })
        .then(res => {
            if (res.status !== 200) {
                error = true;
            };

            res.json();
        })
        .then((json: any) => {
            if (error) {
                addToast({
                    color: "danger",
                    title: "Could not demote mod",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong removing moderator",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button color="warning" onPress={onOpen}>Remove moderator</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Demote Moderator</ModalHeader>

                            <ModalBody>
                                <p>Removing a moderator will remove their moderation abilities, but they will still be a member of the room. You can always add their moderation abilities back at a later date</p>

                                <Form onSubmit={handleSubmit}>
                                    <Select name="user" label="User to demoted from moderator">
                                        {mods.map((person: DatabaseUsers) => (
                                            <SelectItem key={person.githubid}>{person.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <Button color="warning" type="submit" onPress={onclose}>Demote moderator</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};