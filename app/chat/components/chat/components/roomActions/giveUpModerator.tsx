'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

export function GiveUpMod(props: any) {
    const roomId = props.roomId;
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleSubmit(e: any) {
        e.preventDefault();

        let error: boolean = false;

        fetch("../api/rooms/server/moderators", {
            method: "DELETE",
            body: JSON.stringify({
                "roomId": Number(roomId),
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
                    title: "Could not remove you as Space police",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong removing your Space police",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
          <Button color="danger" onPress={onOpen}>Give up Space police</Button>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onclose) => (
                    <>
                        <ModalHeader>Give up Space police</ModalHeader>

                        <ModalBody>
                            <p>Give up your ability to moderate the room. This will let you leave the room</p>

                            <p>You will not be able to regain your moderation ablities unless the owner promotes you again.</p>

                            <Form onSubmit={handleSubmit}>
                                <Button color="danger" type="submit" onPress={onclose}>Give up your ablility to moderate</Button>
                            </Form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
          </Modal>
        </>
    );
};