import './Home.css';
import Room from './Room';
import SideBar from './SideBar';

const Home = (props)=>{
    const user = props.user;

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