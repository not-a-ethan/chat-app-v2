import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";

export function CreateRoom() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    function apiNewRoom(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const roomName: string = data["roomName"].toString();

        if (roomName.trim().length === 0) {
            addToast({
                color: "danger",
                title: "All Spaceships need a title",
                description: "Try creating a Spaceship with a name this time. Rooms have feeling too ya know"
            });
            return;
        };

        addToast({
            title: "Creating room",
            promise: fetch("../api/rooms/server", {
                method: "POST",
                body: JSON.stringify({
                    "name": roomName
                })
            })
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Create Spaceship</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose => (
                        <>
                            <ModalHeader>New Spaceship</ModalHeader>

                            <ModalBody>
                                <Form onSubmit={apiNewRoom}>
                                    <Input type="text" label="Room name" name="roomName" />

                                    <Button onPress={onclose} type="submit">Create Spaceship</Button>
                                </Form>
                            </ModalBody>
                        </>
                    ))}
                </ModalContent>
            </Modal>
        </>
    );
};