import { useParams } from "react-router-dom";
import { useState } from "react";
import Message from "./Message";

const Room = ({user, room, socket}) => {
    const {id} = useParams();
    // const user = fetch('http://localhost:8000/api/user/' + id);
    const [currentMessage, setCurrentMessage] = useState('');
    // const user = {
    //     userName: 'John',
    //     isOnline: true
    // };

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    const sendHandler = async () => {

        const msg = {
            from : user.userName,
            body : currentMessage,
            time : dateTime
        }

        const res = await fetch('http://localhost:8000/api/room/messageList/' + room.roomId, {
            method : 'PUT',
            headers : { 'Content-Type' : 'application/json' },
            body : msg
        });

        const info = {
            roomId : room.roomId,
            message : currentMessage,
            userList : res.userList
        };
        socket.emit('message', info);
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
                <button onClick={sendHandler}>Send</button>  
            </footer>              
        </div>
    </div>

    );
}
 
export default Room;