import './Home.css';

const UserPane = ({user}) => {
    return (  
        <div className="user-pane">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" />
            <div>
                <h2>{user.userName}</h2>
                <h3>
                    {user.isOnline && <span class="status orange"></span>}
                    {!user.isOnline && <span class="status green"></span>}
                    {user.isOnline && <p>Online</p>}
                    {!user.isOnline && <p>Offline</p>}
                </h3>
            </div>
        </div>
    );
}
 
export default UserPane;