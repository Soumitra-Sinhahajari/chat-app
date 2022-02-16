import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
 

const Login = (props) => {

    console.log('hi, i m here');
    const setUserName = props.setUserName;
    const [newUserName, setNewUserName] = useState(null);
    const [Error, setError] = useState(null);
    const History = useHistory();

    const enterButtonClicked = (e) => {
        e.preventDefault();
        console.log(newUserName);
        if(newUserName === null){
            setError('Please enter an user id!');
        }
        fetch('http://localhost:8000/user/'+newUserName)
        .then((res)=>{
            res = res.json();
        })
        .then((user)=>{
            if(user.is_present === true){
                setError('The user id is already taken!');
            }
            else{
                setUserName(newUserName);
                History.push('/home');
            }
        })
        .catch((err)=>{
            console.log(err.message);
        });
    };

    return (
        <div className='login-form'>
            <form onSubmit={ enterButtonClicked }>
                {Error && (<label id='error-message-label'>{ Error }</label>)}
                <br/>
                <label id='name-input-label'>Enter User Name : </label>
                <br/>
                <input type='text' id='name-input' defaultValue='enter unique user name' onChange={ (e)=>{setNewUserName(e.target.value)} }></input>
                <br/>
                <input type='submit'></input>
            </form>
        </div>
    );
};

export default Login;