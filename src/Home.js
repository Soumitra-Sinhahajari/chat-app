import io from 'socket.io-client';
import { useEffect } from 'react';
import './Home.css';
import Room from './Room';
import SideBar from './SideBar';
import { useHistory } from 'react-router-dom';

const Home = (props)=>{
    const user = props.user;
    const setUser = props.setUser;
    let socket = null;

    const History = useHistory();

    useEffect(() => {
        socket = io.connect('http://localhost:8000');
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

        socket.on('message', {

        })

    }, [user]);

    useEffect(() => {
        if (socket !== null) {
            socket.on('message', () => {

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
                    <SideBar user={ user } />
                </aside>
                <main>
                    <Room user={ user } socket={ socket } />
                </main>
            </div>
        </div>
    );
   };
   
   export default Home;