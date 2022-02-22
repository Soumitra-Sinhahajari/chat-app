import { useHistory } from "react-router-dom";
import UserPane from "./UserPane";

const SideBar = ({user, room, setRoom, roomRefresh, setRoomRefresh}) => {

    // const user = props.user;
    // const room = props.user;
    // const setRoom = props.setRoom;

    const rooms = user.joinedRoomList;
    console.log(rooms);

    const History = useHistory();

    const startChat = (e) => {
        e.preventDefault();
        History.push('/create');
    };

    const clickRoom = async (data, e) => {
        // e.preventDefault();
        // Room redirect(history)
        console.log('inside click room');
        console.log('room ' + data.room.roomName + ' clicked');
        const res = await fetch('http://localhost:8000/api/room/' + data.room.roomId);
        if (res.status !== 404 && res.status !== 500) {
            const data = await res.json();
            room = data;
            console.log('getting room');
            console.log(data);
            await setRoom(data);
            setRoomRefresh(roomRefresh + 1);
        } else {
            const data = await res.json();
            console.log(data.errorMessage);
            throw Error('Could not fetch room data.');
        }
        // History.push('/home/' + data.room.roomId);
    };

    return (  
        <div className="side-bar">
            <header>
                <button onClick={startChat}>Start New Chat</button>
            </header>
            <ul>
                {rooms.map((room) => (
                    <li>
                        <div onClick={(e) => clickRoom({room}, e)}>
                            <UserPane room={room} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default SideBar;