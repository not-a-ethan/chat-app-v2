import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import styles from "../../styles/account/changeName.module.css";

export function ChangeName() {
    function handleSubmit(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const newName: string = data["newName"].toString(); 

        if (!newName || newName.length === 0) {
            addToast({
                color: "danger",
                title: "You must have a name"
            });

            return;
        };

        fetch("../api/account/name", {
            method: "PUT",
            body: JSON.stringify({
                "name": newName
            })
        }).catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong changing your name",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
              <Form onSubmit={handleSubmit} className={`${styles.form}`}>
                <Input type="text" label="new name" name="newName" className={`${styles.col1}`} />

                <Button type="submit" className={`${styles.col2}`}>Change name</Button>
              </Form>
        </>
    );
};