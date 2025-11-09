'use client';

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

import { DeleteIcon } from "@/components/icons";

export function DeleteButton(props: any) {
    const messageId = props.id;
    
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    function deleteMessage(e: any) {
        const id = e.target.id;

        if (!id || id <= 0) {
            addToast({
                title: "Something went wrong",
                description: "Could not get message information",
                color: "danger"
            });

            return;
        };

        fetch("../api/message", {
            method: "DELETE",
            body: JSON.stringify({
                "messageId": id
            })
        });
    };

    return (
        <>
            <Button isIconOnly color="danger" onPress={onOpen}>
                <DeleteIcon />
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Are you sure you want to delete the message?</ModalHeader>

                            <ModalBody>
                                <Button color="danger" onPressStart={onclose} onPress={onclose} id={messageId}>Yes I am sure I want to delete</Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};