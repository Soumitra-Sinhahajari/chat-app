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

    const enterLoginButtonClicked = (e) => {
        e.preventDefault();
        console.log(newUserName);
        if(newUserName === null){
            setError('Please enter an user id!');
        }
        fetch('http://localhost:8000/api/user/'+newUserName)
        .then((res)=>{
            if (res.status !== 404 && res.status !== 500) {
                res = res.json();
            } else {
                res = {is_present : false};
            }
        })
        .then((user)=>{
            if(user.is_present === false){
                setError('User not found.');
            }
            else{
                if (user.passWd === password) {
                    setUser(user);
                    History.push('/home');
                } else {
                    setError('Wrong Password.');
                }
            }
        })
        .catch((err)=>{
            console.log(err.message);
        });
    };

    const enterRegisterButtonClicked = (e) => {
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
        fetch('http://localhost:8000/api/user', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(user)
        })
        .then((res)=>{
            if (res.status !== 400 && res.status !== 500) {
                res = res.json();
            } else {
                res = {is_present : true};
            }
        })  
        .then((user)=>{
            if (user.is_present === true) {
                setError('User id is taken. Choose a different user id.');
            } else {
                setUser(user);
                History.push('/home');
            }
        })
        .catch((err)=>{
            console.log(err.message);
        });
    };

    return (
        <div className='login-form'>
            <form>
                {Error && (<label id='error-message-label'>{ Error }</label>)}
                <br/>
                <label id='name-input-label'>Enter User Name : </label>
                <br/>
                <input type='text' id='name-input' defaultValue='enter unique user name' onChange={ (e)=>{setNewUserName(e.target.value)} }></input>
                <br/>
                <input type='password' id='password-input' onChange = {(e) => {setPassword(e.target.value)}}></input>
                <br/>
                <button onClick={enterLoginButtonClicked}>Login</button>
                <button onClick={enterRegisterButtonClicked}>Register</button>
            </form>
        </div>
    );
};

export default Login;