import { ListRooms } from "./components/rooms/listRooms";
import { CreateRoom } from "./components/rooms/createRoom";

export function Rooms(props: any) {
    const room = props["room"];
    const setRoom = props["setRoom"];

    return (
        <>
            <ListRooms roomId={room} setRoom={setRoom} />
            <CreateRoom />
        </>
    );
};