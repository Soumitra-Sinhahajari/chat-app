import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Message from "./Message";

const Room = ({user, room, socket}) => {
    // const {roomId} = useParams();
    // console.log(roomId);

    const {messageList, setMessageList} = useState([]);

    // const {room, setRoom} = useState(null);
    const {sendButtonClicks, setSendButtonClicks} = useState(null);

    useEffect(() => {
        if (room != null)
            setMessageList(room.messageList);
        // fetch('http://localhost:8000/api/room' + roomId)
        // .then(res => {
        //     if (res.status !== 404 && res.status !== 500)
        //         return res.json();
        //     else
        //         throw Error('Could not fetch room data.');
        // })
        // .then(room => {
        //     setRoom(room);// const user = {
    //     userName: 'John',
    //     isOnline: true
    // };

        //     setMessageList(room.messageList);
        // });
    }, [sendButtonClicks]);

    const [currentMessage, setCurrentMessage] = useState('');
    
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
        setSendButtonClicks(sendButtonClicks + 1);
    };

    return (  
    
    <div className="chat-window">
        <div className="chat-header">
            <div className="user-name">
                <p>{room && room.roomName}</p>
            </div>
            {/* <div className="online-status">
                {user.isOnline && <p>Online</p>}
            </div> */}
        </div>
        <hr></hr>
        <div className="chat-body">

            {messageList && messageList.map(message => (
                <Message sender={message.from} time={message.time} isSender={message.from === user.userName} showName={true} />
            ))}

            {/* <Message sender="John" message="Hello" time="2:59 pm" isSender={false} showName={true} />
            <Message sender="You" message="Hello" time="3:01 pm" isSender={true} showName={true} /> */}
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