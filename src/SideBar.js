import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import UserPane from "./UserPane";
import './SideBar.css';

const SideBar = ({user, setUser, rooms, setRooms, room, setRoom, socket, parseUnicast}) => {

    console.log(rooms);

    const addNewRoom = async (newRoomData) => {
        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/user/joinedRoom/' + user._id, {
            method : 'PUT',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(newRoomData)
        });
        
    };
    
    const History = useHistory();

    useEffect(async () => {
        const common_room_index = rooms.findIndex(room => {return room.roomName === 'Common chat room'});
        let common_room_details = rooms[common_room_index];
        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/' + common_room_details.roomId);
        if (res.status !== 404 && res.status !== 500) {
            const data = await res.json();
            room = data;
            setRoom(data);
            console.log('when room clicked');
            console.log(room);
            
        } else {
            const data = await res.json();
            console.log(data.errorMessage);
            throw Error('Could not fetch room data.');
        }
    }, []);
    
    useEffect(() => {
        if(socket !== null){
            socket.on('room created', (info) => {
                let new_room_data = {
                    roomId : info.roomId,
                    roomName : info.roomName,
                    // lastChattedTime : info.lastChattedTime
                };
                
                addNewRoom(new_room_data);

                new_room_data = {
                    roomId : info.roomId,
                    roomName : info.roomName,
                    lastChattedTime : info.lastChattedTime
                };


                setRooms((roomList) => [new_room_data, ...roomList]);
            });
        }
    }, [socket]);


    const clickRoom = async (data, e) => {
        // e.preventDefault();
        // Room redirect(history)
        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/' + data.room.roomId);
        if (res.status !== 404 && res.status !== 500) {
            const data = await res.json();
            room = data;
            setRoom(data);
            console.log('when room clicked');
            console.log(room);
            
        } else {
            const data = await res.json();
            console.log(data.errorMessage);
            throw Error('Could not fetch room data.');
        }
        
    };

    return (  
        <div className="side-bar">
            
            <ul>
                {rooms.sort((firstRoom, secondRoom) => {return secondRoom.lastChattedTime.localeCompare(firstRoom.lastChattedTime);}).map((room) => (
                    <li>
                        <div onClick={(e) => clickRoom({room}, e)}>
                            <UserPane room={room} parseUnicast={parseUnicast} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default SideBar;