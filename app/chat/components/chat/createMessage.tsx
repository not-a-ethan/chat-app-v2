import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";

import styles from "../../../../styles/chat/components/createMessage.module.css";

export function SendMessage(props: any) {
    const roomId = props.roomId;

    function handleSubmit(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const content: string = data["content"].toString();

        if (content.trim().length === 0) {
            return;
        };

        let error: boolean = false;

        fetch("/api/message", {
            method: "POST",
            body: JSON.stringify({
                "content": `${content}`,
                "roomId": `${roomId}`
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
                    title: "Could not send message",
                    description: json["error"]
                });
            } else {
                const input: any|null = document.getElementById("input");

                if (input == null || !input) {
                    return;
                };
                
                input.value = "";
            };
        })
        .catch(e => {
            console.error(e);
            
            addToast({
                color: "danger",
                title: "Something went wrong sending your message",
                description: "More info in developer console"
            });
        });
    };

    return (
        <Form onSubmit={(handleSubmit)} className={`${styles.form}`}>
            <Input placeholder="What do you want to send to the internet?" type="text" name="content" className={`${styles.input}`} id="input" />
            <Button type="submit" color="default" className={`${styles.button}`}>Send</Button>
        </Form>
    );
};