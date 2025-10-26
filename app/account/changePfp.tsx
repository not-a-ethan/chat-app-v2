import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

export function ChangePfp(props: any) {
    function handleChange(e: any) {
        e.preventDefault();

        const inputElm: HTMLInputElement = document.getElementById("newpfp") as HTMLInputElement;

        if (!inputElm.files) {
            return;
        };

        const newPfp: Blob = inputElm.files[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            // Data URL
            const image = e.target?.result;
            

        };

        reader.readAsDataURL(newPfp);
    };

    return (
        <>
            <Form onSubmit={handleChange}>
                <Input label="New Pfp" type="file" name="newpfp" id="newpfp" />

                <Button type="submit">Change</Button>
            </Form>
        </>
    );
};