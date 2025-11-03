'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

import { EditIcon } from "@/components/icons";

export function EditButton(props: any) {
    const messageId = props.id;
    const content = props.content;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function editMessage(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        
        const thisMessageId = e.target.id;

        if (!thisMessageId || thisMessageId <= 0)  {
            addToast({
                title: "Something went wrong",
                description: "Could not get message information",
                color: "danger"
            });

            return;
        };

        if (data["newContent"] === content) {
            addToast({
                title: "You cant edit a message to be the same thing",
                color: "warning"
            });

            return;
        };

        fetch("../api/message", {
            method: "PUT",
            body: JSON.stringify({
                "id": thisMessageId,
                "newContent": data["newContent"]
            })
        });
    };

    return (
        <>
            <Button isIconOnly color="secondary" onPress={onOpen}>
                <EditIcon />    
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Edit message</ModalHeader>

                            <ModalBody>
                                <Form onSubmit={editMessage} id={messageId}>
                                    <Input type="text" defaultValue={content} name="newContent" />

                                    <Button type="submit">Edit message</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};