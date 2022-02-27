import { useEffect, useState } from "react";

const ContactList = ({user, setUser, room, setRoom, rooms, setRooms, socket}) => {

    const [allUsers, setAllUsers] = useState(null);

    const getAllUsers = async () => {
        const res = await fetch('http://localhost:8000/api/user/all');
        if (res.status !== 500) {
            const resdata = await res.json();
            console.log('got contact list from server');
            console.log(resdata);
            const newresdata = resdata.filter((data) => data.userName !== user.userName);
            console.log(newresdata);
            setAllUsers(newresdata);
        } else {
            throw Error('Internal Server Error.');
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);



    const userClicked = async (data, e) => {
        e.preventDefault();
        data = data.User;
        const possible1 = '$'+user.userName+'$'+data.userName+'$', possible2 = '$'+data.userName+'$'+user.userName+'$';
        const isPresent = rooms.find((currRoom) => (currRoom.roomName === possible1 || currRoom.roomName === possible2));
        if (isPresent) {
            const res = await fetch('http://localhost:8000/api/room/' + isPresent.roomId);
            if (res.status !== 404 && res.status !== 500) {
                const roomdata = await res.json();
                room = roomdata;
                setRoom(roomdata);
                console.log('when user clicked');
                console.log(room);
            } else {
                const data = await res.json();
                console.log(data.errorMessage);
                throw Error('Could not fetch room data.');
            }
        } else {
            const userList = [
                {userName : user.userName},
                {userName : data.userName}
            ];

            const newRoom = {
                roomName : possible1,
                userList : userList,
                isBroadcast : false,
                isMulticast : false,
                messageList : []
            };
    
            const res = await fetch('http://localhost:8000/api/room', {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(newRoom)
            });
            if (res.status !== 500) {
                const gotRoom = await res.json();
                console.log('got new room details from server-----');
                console.log(gotRoom);
                setRoom(gotRoom);   
                const joinedRoom = {
                    roomName : gotRoom.roomName,
                    roomId : gotRoom._id,
                    lastChattedTime : gotRoom.messageList[0].time
                };
                const write_new_room = {
                    roomName : gotRoom.roomName,
                    roomId : gotRoom._id,
                };
                const res2 = await fetch('http://localhost:8000/api/user/joinedRoom/'+user._id, {
                    method : 'PUT',
                    headers : { 'Content-Type' : 'application/json' },
                    body : JSON.stringify(write_new_room)
                });
                if (res2.status !== 500 && res2.status !== 404) {
                    setRooms((rooms) => [joinedRoom, ...rooms]);
                    const dummyUserList = gotRoom.userList.filter((currdata) => currdata.userName !== user.userName);
                    console.log('to server');
                    console.log(dummyUserList);
                    const info = {
                        roomId : gotRoom._id,
                        roomName : gotRoom.roomName,
                        userList : dummyUserList
                    };
                    socket.emit('room created', info);

                } else {
                    const data = await res2.json();
                    throw Error(data.errorMessage);
                }
            } else {
                throw Error('Could not post room.');
            }
        }
    };

    return (  
        <div className="contact-list">
            <ul>
                {allUsers && allUsers.map((User) => (
                    <li>
                        <div onClick={(e) => userClicked({User}, e)}>
                        <img src="https://styles.redditmedia.com/t5_2qhv3/styles/communityIcon_tnkxu195see51.png" alt="" width="65px" height="65px" align="middle" />
                        <div>
                            <h2>{User.userName}</h2>
                        </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default ContactList;