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

    const clickRoom = (e) => {
        e.preventDefault();
        // Room redirect(history)
        console.log('mauj');
    };

    return (  
        <div className="side-bar">
            <header>
                <button onClick={startChat}>Start New Chat</button>
            </header>
            <ul>
                {users.map((user) => (
                    <li>
                        <div onClick={clickRoom}>
                            <UserPane room={user} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default SideBar;