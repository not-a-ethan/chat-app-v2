import { Message } from "./components/chat/messages";
import { SendMessage } from "./components/chat/createMessage";

export function Chat(props: any) {
    const roomId = props["roomId"];
    const userId = props["userId"];
    const roomOwner = props["roomOwner"];
    const roomMod = props["roomMod"];

    return (
        <main>
            <Message roomId={roomId} userId={userId} roomOwner={roomOwner} roomMod={roomMod} />
            <SendMessage roomId={roomId} />
        </main>
    );
};