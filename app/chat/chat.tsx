import { Message } from "./components/chat/messages";
import { SendMessage } from "./components/chat/createMessage";

export function Chat(props: any) {
    const roomId = props["roomId"];

    return (
        <>
            <Message roomId={roomId} />
            <SendMessage roomId={roomId} />
        </>
    );
};