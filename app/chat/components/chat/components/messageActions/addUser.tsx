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

        fetch("../api/rooms/server", {
            method: "PUT",
            body: JSON.stringify({
                "room": roomID,
                "username": username
            })
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong adding user to room",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Add Member</Button>

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

                                    <Button onPress={onclose} type="submit">Add User</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};