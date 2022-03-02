import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
 

const Login = (props) => {

    console.log('hi, i m here');
    const setUser = props.setUser;
    const [newUserName, setNewUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [Error, setError] = useState(null);
    const History = useHistory();

    const enterLoginButtonClicked =  async (e) => {
        e.preventDefault();
        console.log(newUserName);
        if(newUserName === null){
            setError('Please enter an user id!');
        }
        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/user/'+newUserName+'/'+password, {
            method : 'GET',
            headers : { 'Content-Type' : 'application/json' }
        });
        if (res.status !== 400 && res.status !== 404 && res.status !== 500) {
            const user = await res.json();
            console.log(user);
            setUser(user);
            History.push('/home');
        } else {
            const data = await res.json();
            console.log(data);
            setError(data.errorMessage);
        }
        
    };

    const enterRegisterButtonClicked = async (e) => {
        e.preventDefault();
        console.log(newUserName);
        const user = {
            userName : newUserName,
            passWd : password,
            joinedRoomList : []
        };
        if(newUserName === null){
            setError('Please enter an user id!');
        }
        const res = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/user', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(user)
        });
        if (res.status !== 400 && res.status !== 500) {
            const user = await res.json();
            setUser(user);
            const commonRoomId = user.joinedRoomList[0].roomId;
            const data = await fetch('https://chat-app-by-kd-ss.herokuapp.com/api/room/userList/'+commonRoomId, {
                method : 'PUT',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify({userName : user.userName})
            });
            if (data.status !== 404 && data.status !== 500) {
                History.push('/home');
            } else {    
                const error = await data.json();
                setError(error.errorMessage);
            }
        } else {
            setError('User id is taken. Choose a different user id.');
        }
        
    };

    return (
        <div className='login-form'>
            <div class="background">
                <div class="shape"></div>
                <div class="shape"></div>
            </div>
            <form>
                {Error && (<label id='error-message-label'>{ Error }</label>)}
                <br/>
                <label for="username">Username</label>
                <br/>
                <input type='text' id='name-input' placeholder='Enter Unique Username' onChange={ (e)=>{setNewUserName(e.target.value)} }></input>
                <br/>
                <label for="password">Password</label>
                <br/>
                <input type='password' id='password-input' placeholder='Enter Password' onChange = {(e) => {setPassword(e.target.value)}}></input>
                <br/>
                <button onClick={enterLoginButtonClicked}>Login</button>
                <button onClick={enterRegisterButtonClicked}>Register</button>
            </form>
        </div>
    );
};

export default Login;