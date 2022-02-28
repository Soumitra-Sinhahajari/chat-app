import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import './Home.css';
import Room from './Room';
import SideBar from './SideBar';
// import { Router } from '@reach/react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import ContactList from './ContactList';

const Home = (props)=>{
    const user = props.user;
    const setUser = props.setUser;
    let socket = null;
    // const [socket, setSocket] = useState(null);

    const [propSocket, setPropSocket] = useState(null);
    const [room, setRoom] = useState(null);
    const [rooms, setRooms ] = useState(null);
    const [create, setCreate] = useState(false);
    const [newMessage, setNewMessage] = useState(false);
    const fetchRooms = async () => {
        const res = await fetch('http://localhost:8000/api/user/roomList/'+user._id);
        const resdata = await res.json();
        console.log('got user list from server ');
        console.log(resdata);
        setRooms(resdata);
    };
    // const [roomRefresh, setRoomRefresh] = useState(null);

    const History = useHistory();

    useEffect(() => {
        socket = io.connect('http://localhost:8000');
        setPropSocket(socket); 
        console.log('socket connected');
        socket.emit('trying-to-connect', {
            userName : user.userName
        });

        socket.on('success', () => {
            console.log('Success at Frontend too.');
            fetchRooms();
        });

        socket.on('error', () => {
            // Insert Error Page
            socket.emit('leaving', {
                userName : user.userName   
            });
        });

        socket.on('disconnect', () => {
            socket.disconnect();
            History.push('/404');
        });

        // socket.on('message', {

        // })

    }, [setPropSocket, user]);

    // useEffect(() => {
    //     if (propSocket !== null) {
    //         propSocket.on('message', (data) => {
    //             if (room._id === data.roomId) {
    //                 room.messageList.push(data.message);
    //             }
    //             console.log('room');
    //             console.log(room);
    //             setRoom(room);
    //             setRoomRefresh(roomRefresh + 1);
    //         });
    //     }
    // }, [propSocket]);

    const newRoom = (e) => {
        e.preventDefault();
        setNewMessage(false);
        setCreate(true);
    };

    const newChat = (e) => {
        e.preventDefault();
        setCreate(false);
        setNewMessage(true);
    };

    const handleTabClosing = () => {

    };
    const unloadCallback = (e) => {
        e.preventDefault();
        console.log(user._id);
        socket.emit('leaving', {
            userName : user.userName
        });
        e.returnValue = 'You are being logged out.';
    };

    window.addEventListener('beforeunload', unloadCallback);
    window.addEventListener('unload', handleTabClosing);

    console.log(user);

    const parseUnicast = (roomname) => {
        if (roomname[0] === '$' && roomname[roomname.length - 1] === '$') {
            const tokens = roomname.split('$', 3);
            console.log('tokens');
            console.log(tokens);
            if (user.userName === tokens[1]) {
                return tokens[2];
            } else {
                return tokens[1];
            }
        } else {
            return roomname;
        }
    };

    return (
        
        <div className="homeOrCreate">
            {/* <BrowserRouter>
                <Route path="/home"> */}
                <div className='home'>
                    <h1 align="center">Welcome {user.userName}!</h1>
                    <div id="container">
                        <aside>
                            {rooms && (<SideBar user={ user } setUser={ setUser } rooms={ rooms } setRooms={ setRooms } room={ room } setRoom={ setRoom } socket={ propSocket } parseUnicast={ parseUnicast } />)}
                        </aside>
                        <main>
                            {room && (<Room user={ user } room={ room } setRoom={ setRoom } rooms={ rooms } setRooms = { setRooms } socket={ propSocket } parseUnicast={ parseUnicast } />)}
                        </main>
                        <aside>
                            <div className="buttons">
                                <button onClick={newChat}>Send a message</button>
                                <button onClick={newRoom}>Create New Room</button>
                            </div>
                            <div className="button-subject">
                                {newMessage && <ContactList user={ user } setUser={ setUser } room={ room } setRoom={ setRoom } rooms={ rooms } setRooms={ setRooms } socket={ propSocket } />}
                                {create && (<CreateRoom user={ user } setUser={ setUser } room={ room } setRoom={ setRoom } rooms={ rooms } setRooms={ setRooms } socket={ propSocket } setCreate={ setCreate } />)}
                            </div>
                        </aside>
                    </div>
                </div>
                {/* </Route>
                <Route path="/create">
                    <CreateRoom user={ user } setUser={ setUser } room={ room } setRoom={ setRoom } socket={ propSocket } />
                </Route>
            </BrowserRouter> */}
        </div>
        
    );
   };
   
   export default Home;