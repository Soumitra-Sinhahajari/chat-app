import { useState } from "react";
import { useHistory } from "react-router-dom";
import './CreateRoom.css';

const CreateRoom = ({user, setUser, room, setRoom, rooms, setRooms, socket, setCreate}) => {
    // const user = props.user;
    // const setUser = props.setUser;
    // const room = props.room;
    // const setRoom = props.setRoom;
    // const socket = props.socket;
    const [userList, setUserList] = useState([]);
    const [userName, setUserName] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [Error, setError] = useState(null);
    const History = useHistory();

    const addMember = async (e) => {
        e.preventDefault();
        // Check if valid username using api
        const res = await fetch('http://localhost:8000/api/user/check/'+userName);
        if (res.status !== 404 && res.status !== 500) {
            // const data = await res.json();
            // console.log(data);
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
        const dummyUserList = userList;
        const userdata = {
            userName : user.userName
        };
        dummyUserList.push(userdata);
        setUserList(userList => [...userList, userdata]);
        console.log(dummyUserList);
        let isMulticast = false;
        if(userList.length > 2) {
            isMulticast = true;
        }

        const newRoom = {
            roomName : roomName,
            userList : dummyUserList,
            isBroadcast : false,
            isMulticast : isMulticast,
            messageList : []
        };

        const res = await fetch('http://localhost:8000/api/room', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(newRoom)
        });
        if (res.status !== 500) {
            const gotRoom = await res.json();
            console.log('got new room details from server-----');
            console.log(gotRoom);
            // setRoom(gotRoom);   
            const joinedRoom = {
                roomName : gotRoom.roomName,
                roomId : gotRoom._id,
                lastChattedTime : gotRoom.messageList[0].time
            };
            const write_new_room = {
                roomName : gotRoom.roomName,
                roomId : gotRoom._id,
            };
            const res2 = await fetch('http://localhost:8000/api/user/joinedRoom/'+user._id, {
                method : 'PUT',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(write_new_room)
            });
            if (res2.status !== 500 && res2.status !== 404) {
                // setUser((user) => {
                //     let updatedUser = {...user};
                //     updatedUser.joinedRoomList = [joinedRoom, ...updatedUser.joinedRoomList];
                //     return updatedUser;
                // });  
                // console.log(user);
                setCreate(false);
                setRooms((rooms) => [joinedRoom, ...rooms]);
                const dummyUserList = gotRoom.userList.filter((data) => data.userName !== user.userName);
                console.log('to server');
                console.log(dummyUserList);
                const info = {
                    roomId : gotRoom._id,
                    userList : dummyUserList
                };
                socket.emit('room created', info);
                // History.push('/home');
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
            <label>Enter Room Name:</label>
            <input type="text" id="roomname-input" onChange={(e) => setRoomName(e.target.value)}></input><br></br>
            {Error && (<label id="error-message-label">{ Error }</label>)}
            <br></br><label>Enter username to add member:</label>
            <input type="text" id="username-input" onChange={(e) => setUserName(e.target.value)}></input>
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
            <button onClick={createRoom}>Create Room</button>
        </div>
    );
}
 
export default CreateRoom;