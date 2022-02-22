import { useEffect, useState } from "react";
import Message from "./Message";

// Problems: 
// Create Room to Home redirection, improper rendering -> room becoming null
// Send button in Room triggering socket not working -> socket is staying null

const Room = ({user, room, socket, roomRefresh, setRoomRefresh}) => {
    // const {roomId} = useParams();
    // console.log(roomId);
    const [messageList, setMessageList] = useState(room === null ? [] : room.messageList);
    let dummyMessageList = room === null ? [] : room.messageList;

    // const {room, setRoom} = useState(null);
    // const [sendButtonClicks, setSendButtonClicks] = useState(null);

    useEffect(() => {
        console.log('inside use effect');
        console.log(room);
        if (room != null) {
            setMessageList(room.messageList);
            dummyMessageList = room.messageList;
            console.log('dummy');
            console.log(dummyMessageList);
            console.log('state');
            console.log(messageList);
        }
        // fetch('http://localhost:8000/api/room' + roomId)
        // .then(res => {
        //     if (res.status !== 404 && res.status !== 500)
        //         return res.json();
        //     else
        //         throw Error('Could not fetch room data.');
        // })
        // .then(room => {
        //     setRoom(room);
        //     setMessageList(room.messageList);
        // });
    }, [roomRefresh]);

    const [currentMessage, setCurrentMessage] = useState('');

    const sendHandler = async () => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        const msg = {
            from : user.userName,
            body : currentMessage,
            time : dateTime
        }

        dummyMessageList.push(msg);

        const res = await fetch('http://localhost:8000/api/room/messageList/' + room._id, {
            method : 'PUT',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(msg)
        });

        const resdata = await res.json();
        console.log('resdata');
        console.log(resdata);

        const info = {
            roomId : room._id,
            message : currentMessage,
            userList : resdata.userList
        };

        console.log('sender side info');
        console.log(info);
        socket.emit('message', info);
        // setSendButtonClicks(sendButtonClicks + 1);
        setRoomRefresh(roomRefresh + 1);
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
            <ul>
                {messageList && messageList.map(message => (
                    <li>
                        <Message sender={message.from} message={message.body} time={message.time} isSender={message.from === user.userName} showName={true} />
                    </li>
                ))}
            </ul>

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