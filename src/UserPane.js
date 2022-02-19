import './Home.css';

const UserPane = ({room}) => {
    return (  
        <div className="user-pane">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" />
            <div>
                <h2>{room.roomName}</h2>
                <h3>
                    <span class="time-right">{room.lastChattedTime}</span>
                </h3>
            </div>
        </div>
    );
}
 
export default UserPane;