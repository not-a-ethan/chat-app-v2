'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

import { DatabaseUsers } from "@/types";

export function AddMod(props: any) {
    const roomId = props.roomId;
    const people: DatabaseUsers[] = props.people;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleSubmit(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const userId: number = Number(data["user"].toString());

        let error: boolean = false;

        fetch("../api/rooms/server/moderators", {
            method: "PUT",
            body: JSON.stringify({
                "roomId": Number(roomId),
                "modId": Number(userId)
            })
        })
        .then(res => {
            if (!res.ok) {
                error = true;
            };

            return res.json();
        })
        .then((json: any) => {
            if (error) {
                addToast({
                    color: "danger",
                    title: "Could not promote user to Space police"
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong promoting user to Space police",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button color="warning" onPress={onOpen}>Add Moderator</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Add Moderator</ModalHeader>

                            <ModalBody>
                                <p>Add moderator. They will have the power the delete any message and kick members</p>

                                <Form onSubmit={handleSubmit}>
                                    <Select name="user" label="User to be promoted to Space police">
                                        {people.map((person: DatabaseUsers) => (
                                            <SelectItem key={person.githubid}>{person.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <Button color="warning" onPress={onclose} type="submit">Promote to Space police</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};