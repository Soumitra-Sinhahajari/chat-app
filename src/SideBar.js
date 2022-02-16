import UserPane from "./UserPane";

const SideBar = () => {

    const users = [{
        userName: 'Shawn',
        isOnline: false
    }, {
        userName: 'Ninja',
        isOnline: true
    }];

    return (  
        <div className="side-bar">
            <header>
                <button>Start New Chat</button>
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