import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import './Home.css';
import Room from './Room';
import SideBar from './SideBar';
// import { Router } from '@reach/react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import CreateRoom from './CreateRoom';

const Home = (props)=>{
    const user = props.user;
    const setUser = props.setUser;
    let socket = null;
    // const [socket, setSocket] = useState(null);

    const [propSocket, setPropSocket] = useState(null);
    const [room, setRoom] = useState(null);
    const [rooms, setRooms ] = useState(user.joinedRoomList);
    const [create, setCreate] = useState(false);
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

    }, [setPropSocket]);

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

    // const user1 = {
    //     userName: 'Shawn',
    //     isOnline: false
    // }, user2 = {
    //     userName: 'Ninja',
    //     isOnline: true
    // };

    return (
        
        <div className="homeOrCreate">
            {/* <BrowserRouter>
                <Route path="/home"> */}
                {create && (<CreateRoom user={ user } setUser={ setUser } room={ room } setRoom={ setRoom } rooms={ rooms } setRooms={ setRooms } socket={ propSocket } setCreate={ setCreate } />)}
                <div className='home'>
                    <h1 align="center">{user.userName}!</h1>
                    <div id="container">
                        <aside>
                            <SideBar user={ user } setUser={ setUser } rooms={ rooms } setRooms={ setRooms } room={ room } setRoom={ setRoom } socket={ propSocket } setCreate={ setCreate } />
                        </aside>
                        <main>
                            <Room user={ user } room={ room } setRoom={ setRoom } socket={ propSocket } />
                        </main>
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