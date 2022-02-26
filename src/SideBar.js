import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import UserPane from "./UserPane";

const SideBar = ({user, setUser, rooms, setRooms, room, setRoom, socket, setCreate}) => {

    // const user = props.user;
    // const room = props.user;
    // const setRoom = props.setRoom;

    // const [rooms, setRooms ] = useState(user.joinedRoomList);
    console.log(rooms);

    const addNewRoom = async (newRoomData) => {
        const res = await fetch('http://localhost:8000/user/joinedRoom/' + user._id, {
            method : 'PUT',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(newRoomData)
        });
        // const resdata = await res.json();
    };
    
    const History = useHistory();

    useEffect(async () => {
        const common_room_index = rooms.findIndex(room => {return room.roomName === 'Common chat room'});
        let common_room_details = rooms[common_room_index];
        const res = await fetch('http://localhost:8000/api/room/' + common_room_details.roomId);
        if (res.status !== 404 && res.status !== 500) {
            const data = await res.json();
            room = data;
            setRoom(data);
            console.log('when room clicked');
            console.log(room);
            // setRoomRefresh(roomRefresh + 1);
        } else {
            const data = await res.json();
            console.log(data.errorMessage);
            throw Error('Could not fetch room data.');
        }
    }, []);
    
    useEffect(() => {
        if(socket !== null){
            socket.on('room created', (info) => {
                let new_room_data = {
                    roomId : info.roomId,
                    roomName : info.roomName,
                    // lastChattedTime : info.lastChattedTime
                };
                
                addNewRoom(new_room_data);

                new_room_data = {
                    roomId : info.roomId,
                    roomName : info.roomName,
                    lastChattedTime : info.lastChattedTime
                };

                // setUser((user) => { let dummyUser = {...user};
                //                     dummyUser.joinedRoomList.push(new_room_data);
                //                     return dummyUser;});

                setRooms((roomList) => [new_room_data, ...roomList]);
            });
        }
    }, [socket]);

    const startChat = (e) => {
        e.preventDefault();
        setCreate(true);
        // History.push('/create');
    };

    const clickRoom = async (data, e) => {
        // e.preventDefault();
        // Room redirect(history)
        const res = await fetch('http://localhost:8000/api/room/' + data.room.roomId);
        if (res.status !== 404 && res.status !== 500) {
            const data = await res.json();
            room = data;
            setRoom(data);
            console.log('when room clicked');
            console.log(room);
            // setRoomRefresh(roomRefresh + 1);
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
                {rooms.sort((firstRoom, secondRoom) => {return secondRoom.lastChattedTime.localeCompare(firstRoom.lastChattedTime);}).map((room) => (
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