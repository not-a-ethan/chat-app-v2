'use client';

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

export function LeaveRoom(props: any) {
    const roomId = props.room;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function leave(e: any) {
        const id = e.target.id;

        if (!id || id <= 0) {
            addToast({
                title: "Something went wrong",
                description: "Could not get room info",
                color: "danger"
            });

            return;
        };

        fetch("../api/rooms/user", {
            method: "PUT",
            body: JSON.stringify({
                "roomId": id
            })
        });
    };

    return (
        <>
            <Button onPress={onOpen} id={roomId}>Leave Room</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Are you sure you want to leave?</ModalHeader>

                            <ModalBody>
                                <h2>You can not rejoin the room unless somebody adds you back</h2>
                                
                                <Button onPaste={leave} color="danger">Yes I am sure I want to leave</Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};