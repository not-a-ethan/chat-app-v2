import { Message } from "./components/chat/messages";
import { SendMessage } from "./components/chat/createMessage";

export function Chat(props: any) {
    const roomId = props["roomId"];
    const userId = props["userId"];
    const roomOwner = props["roomOwner"];

    return (
        <main>
            <Message roomId={roomId} userId={userId} roomOwner={roomOwner} />
            <SendMessage roomId={roomId} />
        </main>
    );
};