import './Home.css';

const UserPane = ({room, parseUnicast}) => {
    return (  
        <div className="user-pane">
            <img src="https://styles.redditmedia.com/t5_2qhv3/styles/communityIcon_tnkxu195see51.png" alt="" width="65px" height="65px" align="middle" />
            <div>
                <h2>{parseUnicast(room.roomName)}</h2>
                <h3>
                    <span class="time-right">{room.lastChattedTime}</span>
                </h3>
            </div>
        </div>
    );
}
 
export default UserPane;