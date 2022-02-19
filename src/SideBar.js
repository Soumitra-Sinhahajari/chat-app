import { useHistory } from "react-router-dom";
import UserPane from "./UserPane";

const SideBar = (props) => {

    const user = props.user;

    const users = user.joinedRoomList;
    console.log(users);

    const History = useHistory();

    const startChat = (e) => {
        e.preventDefault();
        History.push('/create');
    };

    return (  
        <div className="side-bar">
            <header>
                <button onClick={startChat}>Start New Chat</button>
            </header>
            <ul>
                {users.map((user) => (
                    <li>
                        <UserPane room={user} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default SideBar;