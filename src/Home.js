import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import './Home.css';
import Room from './Room';
import SideBar from './SideBar';
// import { Router } from '@reach/react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

const Home = (props)=>{
    const user = props.user;
    const setUser = props.setUser;
    let socket = null;

    const [propSocket, setPropSocket] = useState(null);
    const [room, setRoom] = useState(null);
    const [roomRefresh, setRoomRefresh] = useState(null);

    const History = useHistory();

    useEffect(() => {
        socket = io.connect('http://localhost:8000');
        setPropSocket(socket);
        console.log('socket connected');
        socket.emit('trying-to-connect', {
            userName : user.userName
        });

        socket.on('success', () => {
            console.log('Success at Frontend too.')
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

    }, [user]);

    useEffect(() => {
        if (socket !== null) {
            socket.on('message', () => {
                setRoomRefresh(roomRefresh + 1);
            });
        }
    });

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
        
        <div className='home'>
            <h1 align="center">{user.userName}!</h1>
            <div id="container">
                <aside>
                    <SideBar user={ user } room={ room } setRoom={ setRoom } roomRefresh={ roomRefresh } setRoomRefresh={ setRoomRefresh }/>
                </aside>
                <main>
                    <Room user={ user } room={ room } socket={ propSocket } roomRefresh={ roomRefresh } setRoomRefresh={ setRoomRefresh } />
                    {/* <BrowserRouter>
                        <Switch>
                            <Route exact path="/home/:roomId">
                                <
                            </Route>
                        </Switch>
                    </BrowserRouter> */}
                </main>
            </div>
        </div>
    );
   };
   
   export default Home;