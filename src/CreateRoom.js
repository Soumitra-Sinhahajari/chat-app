import { useState } from "react";
import { useHistory } from "react-router-dom";

const CreateRoom = (props) => {
    const user = props.user;
    const setUser = props.setUser;
    const [userList, setUserList] = useState([]);
    const [userName, setUserName] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [Error, setError] = useState(null);
    const History = useHistory();

    const addMember = async (e) => {
        e.preventDefault();
        // Check if valid username using api
        const res = await fetch('http://localhost:8000/api/usercheck/'+userName);
        if (res.status !== 404 && res.status !== 500) {
            // const data = await res.json();
            // console.log(data);
            setUserList(userList => [userName, ...userList]);
            setError(null);
        } else {
            const data = await res.json();
            console.log(data.errorMessage);
            setError(data.errorMessage);
        }
    };

    const createRoom = async (e) => {
        e.preventDefault();
        setUserList(userList => [userName, ...userList]);
        let isMulticast = false;
        if(userList.length > 2) {
            isMulticast = true;
        }

        const room = {
            roomName : roomName,
            userList : userList,
            isBroadcast : false,
            isMulticast : isMulticast,
            messageList : []
        };

        const res = await fetch('http://localhost:8000/api/room', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(room)
        });
        if (res.status !== 500) {
            const room = await res.json();
            const joinedRoom = {
                roomName : room.roomName,
                roomId : room._id,
                lastChattedTime : null
            };
            const res2 = await fetch('http://localhost:8000/api/user/joinedRoom/'+user._id, {
                method : 'PUT',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(joinedRoom)
            });
            if (res2.status !== 500 && res2.status !== 404) {
                const updatedUser = user;
                updatedUser.joinedRoomList = [joinedRoom, ...updatedUser.joinedRoomList];
                setUser(updatedUser);
                console.log(user);
                History.push('/home');
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
            <li>
                {userList.map((username) => (
                   <li>
                       <div class="container">
                           {username}
                       </div>
                   </li> 
                ))}
            </li>
            <button onClick={createRoom}>Create Room</button>
        </div>
    );
}
 
export default CreateRoom;