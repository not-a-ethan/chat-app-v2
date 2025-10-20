import { ListRooms } from "./components/rooms/listRooms";
import { CreateRoom } from "./components/rooms/createRoom";

export function Rooms(props: any) {
    const room = props["room"];
    const setRoom = props["setRoom"];

    return (
        <span className={`flex flex-wrap gap-2`}>
            <ListRooms roomId={room} setRoom={setRoom} />
            <CreateRoom />
        </span>
    );
};