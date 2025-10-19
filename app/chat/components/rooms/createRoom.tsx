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
                title: "All rooms need a title",
                description: "Try creating a room with a name this time. Rooms have feeling too ya know"
            });
            return;
        };

        fetch("../api/rooms/server", {
            method: "POST",
            body: JSON.stringify({
                "name": roomName
            })
        }).catch(e => {
            console.error(e);
            addToast({
                color: "danger",
                title: "Could not create the room",
                description: "More info in the developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Create Room</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose => (
                        <>
                            <ModalHeader>New Room</ModalHeader>

                            <ModalBody>
                                <Form>
                                    <Input type="text" label="Room name" name="roomName" />

                                    <Button type="submit">Create room</Button>
                                </Form>
                            </ModalBody>
                        </>
                    ))}
                </ModalContent>
            </Modal>
        </>
    );
};