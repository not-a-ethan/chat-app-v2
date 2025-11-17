'use client';

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

export function LeaveRoom(props: any) {
    const roomId = props.room;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function leave(e: any) {
        const id = Number(e.target.id);

        if (!id || id <= 0) {
            addToast({
                title: "Something went wrong",
                description: "Could not get `Spaceship` info",
                color: "danger"
            });

            return;
        };

        let error: boolean = false;

        fetch("../api/rooms/user", {
            method: "PUT",
            body: JSON.stringify({
                "roomId": id
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
                    title: "Could not leave `Spaceship`",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong leaving `Spaceship`",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Leave Room</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Are you sure you want to leave?</ModalHeader>

                            <ModalBody>
                                <h2>You can not rejoin the `Spaceship` unless somebody adds you back</h2>
                                
                                <Button onPressStart={onclose} onPress={leave} color="danger" id={roomId}>Yes I am sure I want to leave</Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};