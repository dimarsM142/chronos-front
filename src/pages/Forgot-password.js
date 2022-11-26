import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import MyInput from "../components/UI/MyInput.js";
import MyButton from '../components/UI/MyButton.js';
import MyLoader from '../components/UI/MyLoader.js';
import './Forgot-password.css';

const ForgotPassword = () => {
    const router = useNavigate();
    const [message, setMessage] = useState('');
    const [dataInputed, setDataInputed] = useState({login:""});
    const [errorText, setErrorText] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [fetchForgotPassword, isPostsLoading, postError] = useFetching(async () => {
            const response = await PostService.forgotPassword(dataInputed.login);
            setMessage(response.data);
            localStorage.setItem('resetLogin', dataInputed.login);
    })
    useEffect(() =>{
        if(postError){
            if(postError.data.comment === 'Incorrect login entered!'){
                setErrorText('Даний логін не зареєстрований');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(postError){
                router('/error');
            }
        }
    }, [postError]);
    
    function sendPass(e){
        e.preventDefault();
        clearTimeout(curTimeoutID);
        if(!dataInputed.login){
            setErrorText('Введіть логін');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        fetchForgotPassword();
        setDataInputed({login:''});
    }
    if(message){
        return (
            <div className="forgotForm">
            <p className="header">ЗМІНА ПАРОЛЯ</p>
            <div className="result-text">
                <p className="main-text">Пароль успішно надіслано вам на пошту.</p>
                <p className="second-text">Перейдіть за посиланням на вашій пошті, щоб встановити новий пароль.</p>
            </div>
            <p className="lastPartName">Згадали пароль?</p>
            <div className="lastPart">
                <Link to="/login">Зайти в акаунт</Link> 
            </div>
            
        </div>
        );
    }
    else{
        return (
            <div>
                {isPostsLoading
                    ?
                    <div className="forgotForm">
                        <p className="header">ЗМІНА ПАРОЛЯ</p>
                        <p className="loading-text">Відбувається надсилання даних. Зачекайте...</p>
                        <div className="loader">
                            <MyLoader />
                        </div>
                    </div>
                    :
                    <div className="forgotForm">
                        <p className="header">ЗМІНА ПАРОЛЯ</p>
                        <p className="nameInput">логін:</p>
                        <MyInput 
                            type="text" 
                            placeholder="логін" 
                            value={dataInputed.login} 
                            onChange={e => {                                    
                                if(e.target.value.length - dataInputed.login.length < 0){
                                    setDataInputed({...dataInputed, login: e.target.value});
                                }
                                else if(e.target.value.length > 20){
                                    clearTimeout(curTimeoutID);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText("Максимальна довжина вашого логіна 20 символів");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    setCurTimeoutID(id);
                                    setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                }
                                else if(!e.target.value[e.target.value.length - 1].match(/[\s<>/|\\:*"'`~,]/)) {
                                    setDataInputed({...dataInputed, login: e.target.value});
                                }
                                else{
                                    clearTimeout(curTimeoutID);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText("Ви не можете ввести пробіли для вашого логіна а також ці символи: \\ / | : * " + '"' + " ' ` , ~ < > ");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    setCurTimeoutID(id);
                                    setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                }
                            }}
                        />    
                        <MyButton type='submit' onClick={sendPass}>Надіслати</MyButton>
                        {errorText && <p className="error">{errorText}</p>} 
                        <p className="lastPartName">Згадали пароль?</p>
                        <div className="lastPart">
                            <Link to="/login">Зайти в акаунт</Link>
                        </div>
                        
                           
                    </div>   
                }      
            </div>
        );
    }

}

export default ForgotPassword;