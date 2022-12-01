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
                setErrorText('This login is not registered');
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
        if(dataInputed.login.length < 1){
            setErrorText('Input login');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        fetchForgotPassword();
        setDataInputed({login:''});
    }
    if(message){
        return (
            <div className="forgotForm">
            <p className="header">RESET PASSWORD</p>
            <div className="result-text">
                <p className="main-text">The password has been successfully emailed to you.</p>
                <p className="second-text">Follow the link in your email to set a new password.</p>
            </div>
            <p className="lastPartName">Have you recalled the password?</p>
            <div className="lastPart">
                <Link to="/login">Log in</Link> 
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
                        <p className="header">RESET PASSWORD</p>
                        <p className="loading-text">Data is being sent. Wait...</p>
                        <div className="loader">
                            <MyLoader />
                        </div>
                    </div>
                    :
                    <div className="forgotForm">
                        <p className="header">RESET PASSWORD</p>
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
                                    setErrorText("The maximum length of your login is 20 characters");
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
                                    setErrorText("You cannot enter spaces for your login and these characters: \\ / | : * " + '"' + " ' ` , ~ < > ");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    setCurTimeoutID(id);
                                    setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                }
                            }}
                        />    
                        <MyButton type='submit' onClick={sendPass}>Send</MyButton>
                        {errorText && <p className="error">{errorText}</p>} 
                        <p className="lastPartName">Have you recalled the password?</p>
                        <div className="lastPart">
                            <Link to="/login">Log in</Link>
                        </div>
                    </div>   
                }      
            </div>
        );
    }

}

export default ForgotPassword;