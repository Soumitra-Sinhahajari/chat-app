import { useState } from "react";
import { useHistory } from "react-router-dom";
import './CreateRoom.css';

const CreateRoom = ({user, setUser, room, setRoom, rooms, setRooms, socket, setCreate}) => {
    
    const [userList, setUserList] = useState([]);
    const [userName, setUserName] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [Error, setError] = useState(null);
    const History = useHistory();

    const addMember = async (e) => {
        e.preventDefault();
        // Check if valid username using api
        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/user/check/'+userName);
        if (res.status !== 404 && res.status !== 500) {
            const data = {
                userName : userName
            };
            setUserList(userList => [data, ...userList]);
            setError(null);
        } else {
            const data = await res.json();
            console.log(data.errorMessage);
            setError(data.errorMessage);
        }
    };

    const createRoom = async (e) => {
        e.preventDefault();
        if (roomName.includes('$')) {
            setError('Invalid Room Name.');
            setUserList([]);
            return;
        }
        const dummyUserList = userList;
        const userdata = {
            userName : user.userName
        };
        dummyUserList.push(userdata);
        setUserList(dummyUserList);
        console.log('when created room');
        console.log(userList);

        const newRoom = {
            roomName : roomName,
            userList : dummyUserList,
            isBroadcast : false,
            isMulticast : true,
            messageList : []
        };

        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(newRoom)
        });
        if (res.status !== 500) {
            const gotRoom = await res.json();
            console.log('got new room details from server-----');
            console.log(gotRoom);
            setRoom(gotRoom);   
            const joinedRoom = {
                roomName : gotRoom.roomName,
                roomId : gotRoom._id,
                lastChattedTime : gotRoom.messageList[0].time
            };
            const write_new_room = {
                roomName : gotRoom.roomName,
                roomId : gotRoom._id,
            };
            const res2 = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/user/joinedRoom/'+user._id, {
                method : 'PUT',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(write_new_room)
            });
            if (res2.status !== 500 && res2.status !== 404) {
                
                setCreate(false);
                setRooms((rooms) => [joinedRoom, ...rooms]);
                const dummyUserList = gotRoom.userList.filter((data) => data.userName !== user.userName);
                console.log('to server');
                console.log(dummyUserList);
                const info = {
                    roomId : gotRoom._id,
                    roomName : gotRoom.roomName,
                    userList : dummyUserList
                };
                socket.emit('room created', info);
            
            } else {
                const data = await res2.json();
                setError(data.errorMessage);
                setUserList([]);
            }
        } else {
            setError('Failed to create room');
            setUserList([]);
        }
    };

    return (  
        <div className="create">
            <div className="create-button">
                <button onClick={createRoom}>Create Room</button>
            </div>
            <div className="create-form">
                <label>Room Name:</label>
                <input type="text" id="roomname-input" placeholder="Enter room name" onChange={(e) => setRoomName(e.target.value)}></input><br></br>
                {Error && (<label id="error-message-label">{ Error }</label>)}
                <br></br><label>Add Member:</label>
                <input type="text" id="username-input" placeholder="Enter username" onChange={(e) => setUserName(e.target.value)}></input>
                <br></br>
                <br></br>
                <button onClick={addMember}>Add Member</button>
                <ul>
                    {userList.map((userdata) => (
                    <li>
                        <div class="container">
                            {userdata.userName}
                        </div>
                    </li> 
                    ))}
                </ul>
            </div>
        </div>
    );
}
 
export default CreateRoom;