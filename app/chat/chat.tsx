import { Message } from "./components/chat/messages";
import { SendMessage } from "./components/chat/createMessage";

export function Chat(props: any) {
    const roomId = props["roomId"];
    const userId = props["userId"];

    return (
        <>
            <Message roomId={roomId} userId={userId} />
            <SendMessage roomId={roomId} />
        </>
    );
};