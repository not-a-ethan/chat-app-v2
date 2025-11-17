import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

export function AddMember(props: any) {
    const roomID = props.roomID;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function addUser(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const username: string = data["username"].toString();

        let error: boolean = false;

        fetch("../api/rooms/server", {
            method: "PUT",
            body: JSON.stringify({
                "room": roomID,
                "username": username
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
                    title: "Could not add Astronaut to room",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong adding Astronaut to room",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Add Astronaut</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>
                                <h2>Add user</h2>
                            </ModalHeader>

                            <ModalBody>
                                <Form onSubmit={addUser}>
                                    <Input label="Username" name="username" />

                                    <Button onPress={onclose} type="submit">Add Astronaut</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};