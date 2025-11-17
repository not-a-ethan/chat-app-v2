'use client';

import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

import { DatabaseUsers } from "@/types";

export function ChangeOwner(props: any) {
    const roomId = props.roomId;
    const people: DatabaseUsers[] = props.people;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleSubmit(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const userId: number = Number(data["user"].toString());

        let error: boolean = false;

        fetch(`../api/rooms/server/ownerActions`, {
            method: "POST",
            body: JSON.stringify({
                "roomId": roomId,
                "userId": userId
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
                    title: "Coiuld not change owner",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong changing owner",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button color="danger" onPress={onOpen}>Change Owner</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Change Room Owner</ModalHeader>

                            <ModalBody>
                                <p>This will change who owns the room. You will still be in the room unless you leave or the new owner kicks you</p>

                                <Form onSubmit={handleSubmit}>
                                    <Select name="user" label="User to give ownership">
                                        {people.map((person: DatabaseUsers) => (
                                            <SelectItem key={person.githubid}>{person.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <Button color="danger" onPress={onclose} type="submit">Change Owner</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}    
                </ModalContent>    
            </Modal>  
        </>
    );
};