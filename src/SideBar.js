import { useHistory } from "react-router-dom";
import UserPane from "./UserPane";

const SideBar = () => {

    const users = [{
        userName: 'Shawn',
        isOnline: false
    }, {
        userName: 'Ninja',
        isOnline: true
    }];
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
                        <UserPane user={user} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default SideBar;