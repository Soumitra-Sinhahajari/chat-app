import { useEffect, useState, useRef } from "react";
import Message from "./Message";
import './Room.css';


// Problems: 
// Create Room to Home redirection, improper rendering -> room becoming null
// Send button in Room triggering socket not working -> socket is staying null

const Room = ({user, room, setRoom, rooms, setRooms, socket, parseUnicast}) => {
    const [messageList, setMessageList] = useState(room === null ? [] : room.messageList);
    let dummyMessageList = room === null ? [] : room.messageList;
    const [thisRoom, setThisRoom] = useState(null);
    const thisRoomId = room === null ? null : room._id;
    const ml_ref = useRef();


    // console.log('room page rendered');
    // console.log(room);

    // useEffect(async (e)=>{
    //     await setMessageList(ml_ref.current);
    // }, []);
    
    // console.log(messageList);
    //const {room, setRoom} = useState(null);
    // const [sendButtonClicks, setSendButtonClicks] = useState(null);

    useEffect(() => {
        console.log("room 28", room);
        if (room !== null) {
            console.log('room changed to not null');
            // setMessageList(dummyMessageList);
            // // messageList = dummyMessageList;
            // // setMessageList(room.messageList);
            // dummyMessageList = room.messageList;
            // console.log('dummy');
            // console.log(dummyMessageList);
            // console.log('state');
            // console.log(messageList);
            dummyMessageList = room.messageList;
            setMessageList(room.messageList);
            // setThisRoom(room);
            ml_ref.current = room.messageList;
            console.log("room 42");
        }
        else{
            console.log('room changed to null');
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
    }, [room]);

    // useEffect(() => {
    //     setRoomRefresh(roomRefresh + 1);
    //     console.log('room refreshed');
    // },[messageList]);

    useEffect((e) => {
        if (socket !== null) {
            // console.log('inside socket(room.js)');
            // console.log(room);
            socket.on('message', (data) => {
                // if (thisRoomId === data.roomId) {

                // const dMessageList = messageList;
                // dMessageList.push(data.message);

                // setMessageList(dMessageList);

                // dummyMessageList = messageList;
                // dummyMessageList.push(data.message);
                // console.log('dummy message list');
                // console.log(dummyMessageList);
                console.log("socket on message----- for" + user.userName);
                // let dml = ml_ref.current;
                // console.log(dml);
                // dml = [...dml, data.message];
                // ml_ref.current = 
                // console.log(dml);
                // setRoom((room) => {if (room && room._id === data.roomId)
                //     setMessageList((messageList) => {return [...messageList, data.message]}); return room;})
                
                // setThisRoom((room) => {
                //                         if (room && room._id === data.roomId){
                //                             setMessageList((messageList) => {return [...messageList, data.message];}); 
                //                         }
                //                         return room;
                //                     });

                                    if (room && room._id === data.roomId){
                                        setMessageList((messageList) => {return [...messageList, data.message];}); 
                                    }

                setRooms((rooms) => {
                    let dummyRooms = [...rooms];
                    console.log('dummy rooms -----');
                    console.log(dummyRooms);
                    const room_index = dummyRooms.findIndex((room) => {return room.roomId === data.roomId;});
                    if(room_index !== undefined){
                        dummyRooms[room_index].lastChattedTime = data.message.time;
                    }
                    return dummyRooms;
                });

                // console.log(ro   om);
                console.log(data);
                

                // }
                // console.log('room');
                // console.log(room);
                // setRoom(room);
                // setRoomRefresh(roomRefresh + 1);
            });
        }
    }, [room, socket]);

    const [currentMessage, setCurrentMessage] = useState('');

    const sendHandler = async () => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0');
        var time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
        var dateTime = date+' '+time;

        const msg = {
            from : user.userName,
            body : currentMessage,
            time : dateTime
        }

        // dummyMessageList.push(msg);

        const res = await fetch('http://localhost:8000/api/room/messageList/' + room._id, {
            method : 'PUT',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(msg)
        });

        const resdata = await res.json();

        const info = {
            roomId : room._id,
            message : msg,
            userList : resdata.userList
        };

        console.log('when send button clicked');
        console.log(info);


        // setRoom(room);
        socket.emit('message', info);
        // setRoom(room);
        // setSendButtonClicks(sendButtonClicks + 1);
        // setRoomRefresh(roomRefresh + 1);
        
    };

    const leaveRoomHandler = async () => {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0');
        var time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
        var dateTime = date+' '+time;
        const msgbody = user.userName + ' left';
        const msg = {
            from : 'none',
            body : msgbody,
            time : dateTime
        };
        const joinedRoom = {
            roomName : room.roomName,
            roomId : room._id
        };
        const userres = await fetch('http://localhost:8000/api/user/joinedRoom/' + user._id, {
            method : 'DELETE',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(joinedRoom)
        });
        if (userres.status !== 404 && userres.status !== 500) {
            const roomres = await fetch('http://localhost:8000/api/room/userList/' + room._id, {
                method : 'DELETE',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify({userName : user.userName})
            });
            if (roomres.status !== 404 && roomres.status !== 500) {
                const data = await roomres.json();
                const res = await fetch('http://localhost:8000/api/room/messageList/' + room._id, {
                    method : 'PUT',
                    headers : { 'Content-Type' : 'application/json' },
                    body : JSON.stringify(msg)
                });
                const info = {
                    roomId : room._id,
                    message : msg,
                    userList : data.userList
                }
                socket.emit('message', info);
                setRooms((rooms) => rooms.filter((currRoom) => currRoom.roomId !== room._id));
                const common_room_index = rooms.findIndex(room => {return room.roomName === 'Common chat room'});
                let common_room_details = rooms[common_room_index];
                const res2 = await fetch('http://localhost:8000/api/room/' + common_room_details.roomId);
                if (res2.status !== 404 && res2.status !== 500) {
                    const data = await res2.json();
                    room = data;
                    setRoom(data);
                    console.log('when room clicked');
                    console.log(room);
                } else {
                    const data = await res.json();
                    console.log(data.errorMessage);
                    throw Error('Could not fetch room data.');
                }
            } else {
                const data = await userres.json();
                throw Error(data.errorMessage);
            }
        } else {
            const data = await userres.json();
            throw Error(data.errorMessage);
        }
    };

    return (  
    
    <div className="chat-window">
        <div className="chat-header">
            <p>{room && parseUnicast(room.roomName)}</p>
            {room.isMulticast && (<button onClick={leaveRoomHandler}>Leave Room</button>)}
            {/* <div className="online-status">
                {user.isOnline && <p>Online</p>}
            </div> */}
        </div>
        {/* <hr></hr> */}
        <div className="chat-body">
            <ul>
                {messageList && messageList.map((message,i) => (
                    <li>
                        <Message key={i} sender={message.from} message={message.body} time={message.time} isSender={message.from === user.userName} showName={true} />
                    </li>
                ))}
            </ul>

            {/* <Message sender="John" message="Hello" time="2:59 pm" isSender={false} showName={true} />
            <Message sender="You" message="Hello" time="3:01 pm" isSender={true} showName={true} /> */}
        </div>
        <div className="chat-sending-options">
            <div className="send-message">
                {room && 
                    (<footer>
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                        />
                        <button onClick={sendHandler}>Send</button>  
                    </footer>)  
                }            
            </div>
        </div>
    </div>

    );
}
 
export default Room;