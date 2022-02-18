import { useState } from "react";
import { useHistory } from "react-router-dom";

const CreateRoom = () => {
    const [userList, setUserList] = useState([]);
    const [userName, setUserName] = useState(null);
    const History = useHistory();

    const addMember = (e) => {
        e.preventDefault();
        // Check if valid username using api
        
        setUserList(userList => [userName, ...userList]);
    };

    const createRoom = (e) => {
        e.preventDefault();

        History.push('/home');
    };

    return (  
        <div className="create">
            <label>Enter username to add member:</label>
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