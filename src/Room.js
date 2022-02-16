import { useParams } from "react-router-dom";
import { useState } from "react";
import Message from "./Message";

const Room = () => {
    const {id} = useParams();
    // const user = fetch('http://localhost:8000/api/user/' + id);
    const [currentMessage, setCurrentMessage] = useState('');
    const user = {
        userName: 'John',
        isOnline: true
    };

    return (  
    
    <div className="chat-window">
        <div className="chat-header">
            <div className="user-name">
                <p>{user.userName}</p>
            </div>
            <div className="online-status">
                {user.isOnline && <p>Online</p>}
            </div>
        </div>
        <hr></hr>
        <div className="chat-body">

            <Message sender="John" message="Hello" time="2:59 pm" isSender={false} showName={true} />
            <Message sender="You" message="Hello" time="3:01 pm" isSender={true} showName={true} />
        </div>
        <div className="send-message">
            <footer>
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button>Send</button>  
            </footer>              
        </div>
    </div>

    );
}
 
export default Room;