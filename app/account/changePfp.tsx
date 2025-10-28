import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

export function ChangePfp() {
    function handleChange(e: any) {
        e.preventDefault();

        const inputElm: HTMLInputElement = document.getElementById("newpfp") as HTMLInputElement;

        if (!inputElm.files) {
            return;
        };

        const newPfp: Blob = inputElm.files[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            // Data URI
            const image = e.target?.result;
            
            fetch("../api/account/pfp", {
                method: "PUT",
                body: JSON.stringify({
                    "pfp": image
                })
            }).catch(e => {
                addToast({
                    color: "danger",
                    title: "Something went wrong changeing your pfp",
                    description: "More info in developer console"
                })
            });
        };

        reader.readAsDataURL(newPfp);
    };

    function handleDelete(e: any) {
        if (!e) {
            return;
        }
        
        fetch("../api/account/pfp", {
            method: "DELETE"
        }).catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong deleting your pfp",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Form onSubmit={handleChange}>
                <Input label="New Pfp" type="file" name="newpfp" id="newpfp" />

                <Button type="button" color="danger" onPress={handleDelete}>Delete</Button>

                <Button type="submit">Change</Button>
            </Form>
        </>
    );
};