import { useEffect, useState, useRef } from "react";
import Message from "./Message";
import './Room.css';


const Room = ({user, room, setRoom, rooms, setRooms, socket, parseUnicast}) => {
    const [messageList, setMessageList] = useState(room === null ? [] : room.messageList);
    let dummyMessageList = room === null ? [] : room.messageList;
    const [thisRoom, setThisRoom] = useState(null);
    const thisRoomId = room === null ? null : room._id;
    const ml_ref = useRef();


    useEffect((e) => {
        console.log("room 28", room);
        if (room !== null) {
            console.log('room changed to not null');
            
            dummyMessageList = room.messageList;
            setMessageList(room.messageList);
            // setThisRoom(room);
            ml_ref.current = room.messageList;
            console.log("room 42");
        }
        else{
            console.log('room changed to null');
        }
        if (socket !== null) {
            
            socket.on('message', (data) => {
                
                console.log("socket on message----- for" + user.userName);
            

                if (room && room._id === data.roomId){
                    console.log('received message');
                    console.log(data.message);
                    setMessageList((messageList) => {
                        if(messageList[messageList.length-1] === data.message)
                            return messageList;
                        else
                            return [...messageList, data.message];
                    }); 
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

                console.log(data);
                
            });
        }
    }, [room]);

    const [currentMessage, setCurrentMessage] = useState('');
    const [currentImage, setCurrentImage] = useState(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (err) => {
            reject(err);
          };
        });
    };

    const sendHandler = async () => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0');
        var time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
        var dateTime = date+' '+time;

        const msg = {
            from : user.userName,
            body : currentMessage,
            time : dateTime,
            isImage : false
        }

        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/messageList/' + room._id, {
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
        setCurrentMessage('');
        
    };

    const sendImageHandler = async () => {

        console.log(currentImage);
        const imgbase64 = await convertToBase64(currentImage);

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate().toString().padStart(2, '0');
        var time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
        var dateTime = date+' '+time;

        const msg = {
            from : user.userName,
            body : imgbase64,
            time : dateTime,
            isImage : true
        };

        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/messageList/' + room._id, {
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

        socket.emit('message', info);
        // setCurrentImage(null);

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
            time : dateTime,
            isImage : false
        };
        const joinedRoom = {
            roomName : room.roomName,
            roomId : room._id
        };
        const userres = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/user/joinedRoom/' + user._id, {
            method : 'DELETE',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(joinedRoom)
        });
        if (userres.status !== 404 && userres.status !== 500) {
            const roomres = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/userList/' + room._id, {
                method : 'DELETE',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify({userName : user.userName})
            });
            if (roomres.status !== 404 && roomres.status !== 500) {
                const data = await roomres.json();
                const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/messageList/' + room._id, {
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
                const res2 = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/' + common_room_details.roomId);
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
        </div>
        {/* <hr></hr> */}
        <div className="chat-body">
            <ul>
                {messageList && messageList.map((message,i) => (
                    <li>
                        <Message key={i} sender={message.from} message={message.body} time={message.time} isImage={message.isImage} isSender={message.from === user.userName} showName={true} />
                    </li>
                ))}
            </ul>
        </div>
        <div className="chat-sending-options">
            {room && 
                (<div className="send-message">
                    <input type="text" placeHolder = "Enter new chat" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)}/>
                    <button onClick={sendHandler}>Send</button>
                    <input type="file" accept="image/*" onChange={(e) => setCurrentImage(e.target.files[0])} />
                    <button onClick={sendImageHandler}>Send Image</button>
                </div>)}    
        </div>
    </div>

    );
}
 
export default Room;