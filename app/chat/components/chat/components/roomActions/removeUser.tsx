'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { DatabaseUsers } from "@/types";

export function RemoveUser(props: any) {
    const roomId = props.roomId;
    const people: DatabaseUsers[] = props.people;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleSubmit(e: any) {
        e.preventDefault();
        
        const data = Object.fromEntries(new FormData(e.currentTarget));

        const userId = data["user"].toString();

        let error: boolean = false;

        fetch(`../api/rooms/server/ownerActions/users`, {
            method: "DELETE",
            body: JSON.stringify({
                "userId": userId,
                "roomId": roomId
            })
        })
        .then(res => {
            if (res.status !== 200) {
                error = true;
            };

            res.json();
        })
        .then((json: any) => {
            if (error) {
                addToast({
                    color: "danger",
                    title: "Could not kick user",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong kicking user",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen} color="danger">Remove user</Button>

              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Remove User</ModalHeader>

                            <ModalBody>
                                <p>This will kick a user from the room</p>

                                <Form onSubmit={handleSubmit}>
                                    <Select name="user" label="User to kick">
                                        {people.map((person: DatabaseUsers) => (
                                            <SelectItem key={person.githubid}>{person.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <Button color="danger" onPress={onclose} type="submit">Remove User</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
              </Modal>
        </>
    );
};