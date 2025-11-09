'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

export function RenameRoom(props: any) {
    const roomId: number = Number(props.roomId);
    const currentName: string = props.currentName;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleSubmit(e: any) {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(e.currentTarget));
        const newName: string = formData["newName"].toString();

        fetch(`../api/rooms/server/owner`, {
            method: "PUT",
            body: JSON.stringify({
                "id": roomId,
                "newName": newName
            })
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong renaming room",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Rename Room</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Rename room</ModalHeader>

                            <ModalBody>
                                <Form onSubmit={handleSubmit}>
                                    <Input defaultValue={currentName} type="text" name="newName" />

                                    <Button onPress={onclose} type="submit">Change name</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};