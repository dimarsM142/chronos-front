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
                setErrorText('Даний логін не існує');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
                
            }
            else if(errorLogin.data.comment === 'Password is not correct!'){
                setErrorText('Даний пароль не є валідним');
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
            setErrorText('Заповніть поле логіну');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(!dataInputed.password){
            setErrorText('Заповніть поле пароля');
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
                    <p className="header">ВХІД</p>
                    <p className="loading-text">Відбувається надсилання даних. Зачекайте...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
                :
                <div>
                    {isAvatarLoading
                        ?
                        <div className="loginForm">
                            <p className="header">ВХІД</p>
                            <p className="loading-text">Відбувається надсилання даних. Зачекайте...</p>
                            <div className="loader">
                                <MyLoader />
                            </div>
                        </div>
                        :
                        <div className="loginForm">
                            <p className="header">ВХІД</p>
                            <p className="nameInput">логін:</p>
                            <MyInput type="text" placeholder="логін" value={dataInputed.login} onChange={e => setDataInputed({...dataInputed, login: e.target.value})}/>
                            <p className="nameInput">пароль:</p>
                            <MyInput type="password" placeholder="пароль" value={dataInputed.password} onChange={e => setDataInputed({...dataInputed, password: e.target.value})}/>
                            <div className="forgotPassword">
                                <Link to="/forgot-password">Забули пароль?</Link>
                            </div>
                            <MyButton type='submit' onClick={sendPass}>Увійти</MyButton>
                            {errorText && <p className="error">{errorText}</p>}
                            <p className="lastPartName">Не маєте акаунту?</p>
                            <div className="lastPart" >
                                <Link to="/register">Реєструйтесь</Link>
                            </div>
                        </div>
                    }
                </div>
                         
            }     
        </div>
    );
}

export default Login;