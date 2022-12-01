import React, { useEffect, useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import MyInput from "../components/UI/MyInput.js";
import MyButton from '../components/UI/MyButton.js';
import MyLoader from '../components/UI/MyLoader.js';
import './Register.css';

function checkEmail(email){
    let arrOfAt = email.match(/@/g);
    if(!arrOfAt || arrOfAt.length !== 1){
        return false;
    }
    if(!email.slice(email.indexOf('@') + 1) || email.slice(email.indexOf('@') + 1).indexOf('.') === -1|| email.slice(email.indexOf('@') + 1).indexOf('-') !== -1 || email.slice(email.indexOf('@') + 1).indexOf('_') !== -1){
        return false;
    }
    if(!email.endsWith('gmail.com')){
        return false;
    };
    return true;
}

const Register = () => {
    
    const router = useNavigate();
    
    const [dataInputed, setDataInputed] = useState({login:'', password:'',passwordConfirmation:'', email:'', fullName:''});
    const [error, setError] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [fetchRegister, isPostsLoading, postError] = useFetching(async () => {// eslint-disable-next-line
            let res = await PostService.register(dataInputed.login, dataInputed.password, dataInputed.email, dataInputed.fullName);
            setError("success");
            setTimeout(() =>{
                router('/login');
            }, 3000);

    })
    useEffect(() =>{
        if(postError){
            if(postError.data.comment === "A user with this login already exists!"){
                setError('This login already exists. Try another one');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);// eslint-disable-next-line
            }
            else if(postError.data.comment === "A user with this email already exists!"){
                setError('This email already exists. Try another one');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);
            }
            else {
                router('/error');
            }
        }// eslint-disable-next-line
    }, [postError]);
    
    function sendPass(e){
        clearTimeout(curTimeoutID);
        e.preventDefault();
        if(dataInputed.login.length < 4){
            setError('Enter a login with more than 4 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(dataInputed.password !== dataInputed.passwordConfirmation){
            setError('Passwords do not match');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(dataInputed.password.length < 8){
            setError('Enter a password longer than 8 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!checkEmail(dataInputed.email)){
            setError('Enter an existing address');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!dataInputed.fullName || dataInputed.fullName.length <= 8){
            setError("Your name must be longer than 8 characters");
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else {
            fetchRegister(); 
            setDataInputed({login:'', password:'',passwordConfirmation:'', email:'', fullName:''});
        }       
    }


    return (
        <div>
            {isPostsLoading
                ?
                <div className="registerForm">
                    <p className="header">SIGN UP</p>
                    <p className="loading-text">Data is being sent. Wait...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
                :
                <div>
                    {error === 'success' 
                        ?
                        <div className="registerForm">
                            <p className="header">SIGN UP</p>
                            <div className="result-text">
                                <p className="main-text">Account successfully registered.</p>
                                <p className="second-text">You can now log in to your account.</p>
                            </div> 
                        </div>
                        :
                        <div className="registerForm">
                            <p className="header">SIGN UP</p>
                            <p className="nameInput">login:</p>
                            <MyInput 
                                type="text" 
                                placeholder="login" 
                                value={dataInputed.login} 
                                onChange={e => {                                    
                                    if(e.target.value.length - dataInputed.login.length < 0){
                                        setDataInputed({...dataInputed, login: e.target.value});
                                    }
                                    else if(e.target.value.length > 20){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("The maximum length of your login is 20 characters");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[\s<>/|\:*"'`~,]/)) {
                                        setDataInputed({...dataInputed, login: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("You cannot enter spaces for your login and these characters: \\ / | : * " + '"' + " ' ` , ~ < > ");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            />
                            <p className="nameInput">password:</p>
                            <MyInput 
                                type="password" 
                                placeholder="password" 
                                value={dataInputed.password} 
                                onChange={e => {
                                    if(e.target.value.length > 32){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("The maximum length of your password is 32 characters");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else {
                                        setDataInputed({...dataInputed, password: e.target.value});
                                    }
                                }}
                            />
                            <p className="nameInput">password confirmation:</p>
                            <MyInput 
                                type="password"
                                placeholder="confirm password" 
                                value={dataInputed.passwordConfirmation} 
                                onChange={e => { 
                                    if(e.target.value.length > 32){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("The maximum length of your password is 32 characters");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else {
                                        setDataInputed({...dataInputed, passwordConfirmation: e.target.value});
                                    }
                                    
                                }}
                            />
                            <p className="nameInput">email:</p>
                            <MyInput 
                                type="text" 
                                placeholder="email" 
                                value={dataInputed.email} 
                                onChange={e => { 
                                    if(e.target.value.length - dataInputed.email.length < 0){
                                        setDataInputed({...dataInputed, email: e.target.value})
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[^a-z_\-.@0-9]/)) {
                                        setDataInputed({...dataInputed, email: e.target.value})
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("Allowed characters for email input: a-z, 0-9, _, -, .");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                }}
                            />
                            <p className="nameInput">full name:</p>
                            <MyInput 
                                type="text" 
                                placeholder="full name" 
                                value={dataInputed.fullName} 
                                onChange={e => {
                                    if(e.target.value.length - dataInputed.fullName.length < 0){
                                        setDataInputed({...dataInputed, fullName: e.target.value});
                                    }
                                    else if(e.target.value.length > 42){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("The maximum length of your name is 42 characters");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[/|\\"'`]/)) {
                                        setDataInputed({...dataInputed, fullName: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("You cannot enter these characters for your name: \\ / | " + '"' + " ' `");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            />
                            <MyButton type='submit' onClick={sendPass}>Sign up</MyButton>
                            {error && <p className="error">{error}</p>}       
                            <p className="lastPartName">You already have an account?</p>
                            <div className="lastPart">
                                <Link to="/login">Log in</Link>
                            </div>
                            
                        </div>   
                    }
                   
                </div>
            }

            
        </div>
    );
}

export default Register;