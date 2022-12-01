import React, { useEffect, useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import MyInput from "../components/UI/MyInput.js";
import MyButton from '../components/UI/MyButton.js';
import MyLoader from '../components/UI/MyLoader.js';
import './Login.css';

const Login = (props) => {
    
    const router = useNavigate();  
    const [dataInputed, setDataInputed] = useState({login:"", password:""});
    const [errorText, setErrorText] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [fetchUserAva, isAvatarLoading, avatarError] = useFetching(async () => {
        const response = await PostService.getUserAvatar(localStorage.getItem('access'));
        localStorage.setItem('ava', response.data.picture);
        localStorage.setItem('isAuth', 'true');
        props.setAuth(true);
        props.refreshToken();
        router('/calendars');

    })

    const [fetchLogin, isPostsLoading, errorLogin] = useFetching(async () => {
            const response = await PostService.login(dataInputed.login, dataInputed.password);

            localStorage.setItem('access', response.data.accessToken);
            localStorage.setItem('refresh', response.data.refreshToken);
            //localStorage.setItem('role', response.data.role);
            fetchUserAva();            
    })
    useEffect(()=>{
        localStorage.setItem('login', ' ');
        localStorage.setItem('ava', ' ');
    }, []);
    useEffect(() =>{
        if(errorLogin){
            if(errorLogin.data.comment === 'User with given login does not exist!'){
                setErrorText('This login does not exist');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
                
            }
            else if(errorLogin.data.comment === 'Password is not correct!'){
                setErrorText('This password is not valid');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(errorLogin.data.comment !== ''){
                router('/error');
            }
        }
    }, [errorLogin]);

    useEffect(()=>{
        if(avatarError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    }, [avatarError])

    function sendPass(e){
        clearTimeout(curTimeoutID);
        e.preventDefault();
        if(!dataInputed.login){
            setErrorText('Fill in the login field');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(!dataInputed.password){
            setErrorText('Fill in the password field');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        fetchLogin();
        localStorage.setItem('login', dataInputed.login);
        
        setDataInputed({login:'', password:''});
        
    }
    
    return (
        <div>
            {isPostsLoading
                ?
                <div className="loginForm">
                    <p className="header">LOG IN</p>
                    <p className="loading-text">Data is being sent. Wait...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
                :
                <div>
                    {isAvatarLoading
                        ?
                        <div className="loginForm">
                            <p className="header">LOG IN</p>
                            <p className="loading-text">Data is being sent. Wait...</p>
                            <div className="loader">
                                <MyLoader />
                            </div>
                        </div>
                        :
                        <div className="loginForm">
                            <p className="header">LOG IN</p>
                            <p className="nameInput">login:</p>
                            <MyInput type="text" placeholder="login" value={dataInputed.login} onChange={e => setDataInputed({...dataInputed, login: e.target.value})}/>
                            <p className="nameInput">password:</p>
                            <MyInput type="password" placeholder="password" value={dataInputed.password} onChange={e => setDataInputed({...dataInputed, password: e.target.value})}/>
                            <div className="forgotPassword">
                                <Link to="/forgot-password">Forgot password?</Link>
                            </div>
                            <MyButton type='submit' onClick={sendPass}>Log in</MyButton>
                            {errorText && <p className="error">{errorText}</p>}
                            <p className="lastPartName">Don't have an account??</p>
                            <div className="lastPart" >
                                <Link to="/register">Sign up</Link>
                            </div>
                        </div>
                    }
                </div>
                         
            }     
        </div>
    );
}

export default Login;