import { useEffect, useState } from "react";

const ContactList = () => {

    const [allUsers, setAllUsers] = useState(null);

    const getAllUsers = async () => {
        const res = await fetch('http://localhost:8000/api/user/all');
        if (res.status !== 500) {
            const resdata = await res.json();
            console.log('got contact list from server');
            console.log(resdata);
            setAllUsers(resdata);
        } else {
            throw Error('Internal Server Error.');
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const userClicked = (e) => {
        e.preventDefault();
    };

    return (  
        <div className="contact-list">
            <ul>
                {allUsers && allUsers.map((user) => (
                    <li>
                        <div onClick={userClicked}>
                        <img src="https://styles.redditmedia.com/t5_2qhv3/styles/communityIcon_tnkxu195see51.png" alt="" width="65px" height="65px" align="middle" />
                        <div>
                            <h2>{user.userName}</h2>
                        </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default ContactList;