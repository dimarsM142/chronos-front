import React, { useEffect, useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import MyInput from "../components/UI/MyInput.js";
import MyButton from '../components/UI/MyButton.js';
import MyLoader from '../components/UI/MyLoader.js';
import './Reset-password.css';
const PasswordReset = () => {
    const router = useNavigate();
    const [dataInputed, setDataInputed] = useState({password:""});
    const [errorText, setErrorText] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();

    const [fetchForgotPassword, isPostsLoading, postError] = useFetching(async () => {
            await PostService.resetPassword(dataInputed.password, window.location.pathname.replace('/forgot-password/', ''), localStorage.getItem('resetLogin'));
            setErrorText("success");
            localStorage.setItem('resetLogin', '');
            setTimeout(() =>{
                router('/login');
            }, 3000);
    })
    useEffect(() =>{
        if(postError){
            if(postError.data.comment === 'Token expired!'){
                setErrorText('Час вичерпався. Спробуйте ще раз надіслати дані.');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(postError.data.comment === 'Incorrect token!'){
                setErrorText('Ви перейшли за поганим посиланням. Спробуйте ще раз надіслати дані.');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else {
                //router('/error');
            }
        }
    }, [postError]);

    function sendPass(e){
        e.preventDefault();
        clearInterval(curTimeoutID);
        if(dataInputed.password.length < 8){
            setErrorText('Введіть пароль довжиною більше 8 символів');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        fetchForgotPassword();
        setDataInputed({password:''});
    }
    if(errorText === 'success'){
        return (
            <div className="resetForm">
                <p className="header">ЗМІНА ПАРОЛЯ</p>
                <div className="result-text">
                    <p className="main-text">Пароль успішно змінено.</p>
                    <p className="second-text">Зараз ви автоматично перейдете на сторінку для входу в акаунт. Введіть ваш логін та новий пароль</p>
                </div>
            </div>
        );
    }
    else{
        return (
            <div>
                {isPostsLoading
                    ?
                    <div className="resetForm">
                    <p className="header">ЗМІНА ПАРОЛЯ</p>
                    <p className="loading-text">Відбувається надсилання даних. Зачекайте...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
                    :
                    <div className="resetForm">
                        <p className="header">ЗМІНА ПАРОЛЯ</p>
                        <p className="nameInput">новий пароль:</p>
                        <MyInput 
                            type="password" 
                            placeholder="пароль" 
                            value={dataInputed.password} 
                            onChange={e => {
                                if(e.target.value.length > 32){
                                    clearTimeout(curTimeoutID);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText("Максимальна довжина вашого пароля 32 символи");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    setCurTimeoutID(id);
                                    setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                }
                                else {
                                    setDataInputed({...dataInputed, password: e.target.value});
                                }
                            }}
                        />    
                        <MyButton type='submit' onClick={sendPass}>Надіслати</MyButton>
                        {errorText && <p className="error">{errorText}</p>}
                        <p className="lastPartName">Виникла помилка? Спробуйте надіслати ще раз</p>
                        <div className="lastPart" >
                            <Link to="/forgot-password">Змінити пароль</Link> 
                        </div>        
                    </div>   
                }
            </div>
        );
    }

}

export default PasswordReset;