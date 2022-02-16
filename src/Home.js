import './Home.css';
import Room from './Room';
import SideBar from './SideBar';
import UserPane from './UserPane';

const Home = ()=>{

    const user1 = {
        userName: 'Shawn',
        isOnline: false
    }, user2 = {
        userName: 'Ninja',
        isOnline: true
    };

    return (
        // <div className='chat-app-body'>
        //     <div className="output-section">
        //         <h1>Here chats will be outputted</h1><hr></hr>
        //     </div>
        //     <div className="input-section">
        //         <div className="input-area">
        //             <p>Enter your text here</p>
        //         </div>
        //         <div className="send-button">
        //             <p>Send from here...</p>
        //         </div>
        //     </div>
        // </div>

        <div id="container">
            <aside>
                <SideBar />
            </aside>
            <main>
                <Room />
            </main>
        </div>
    );
   };
   
   export default Home;