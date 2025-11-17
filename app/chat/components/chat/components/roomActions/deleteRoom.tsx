'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

export function DeleteRoom(props: any) {
    const roomId: number = Number(props.roomId);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleSubmit(e: any) {
        e.preventDefault();

        let error: boolean = false;

        fetch(`../api/rooms/server/owner`, {
            method: "DELETE",
            body: JSON.stringify({
                "roomId": roomId
            })
        })
        .then(res => {
            location.reload();

            if (!res.ok) {
                error = true;
            };

            return res.json();
        })
        .then((json: any) => {
            if (error) {
                addToast({
                    color: "danger",
                    title: "Could not delete Spaceship",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong deleting Spaceship",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button color="danger" onPress={onOpen}>Delete room</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Delete room</ModalHeader>

                            <ModalBody>
                                <Form onSubmit={handleSubmit}>
                                    <Button color="danger" type="submit" onPress={onclose}>
                                        Are you absoluty sure you want to delete this Spaceship?<br />THIS CAN NOT BE UNDONE
                                    </Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
};