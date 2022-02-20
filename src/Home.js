import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import './Home.css';
import Room from './Room';
import SideBar from './SideBar';

const Home = (props)=>{
    const user = props.user;
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const dummySocket = io.connect('http://localhost:8000');
        setSocket(dummySocket);
        console.log('socket connected');
        dummySocket.emit('trying-to-connect', {
            userID : user._id
        });

        dummySocket.on('success', () => {
            console.log('Success at Frontend too.')
        });

        dummySocket.on('error', () => {
            // Insert Error Page
            dummySocket.emit('leaving', {
                userID : user._id   
            });
        });

    }, [user]);


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
                    <SideBar user={ user } />
                </aside>
                <main>
                    <Room />
                </main>
            </div>
        </div>
    );
   };
   
   export default Home;