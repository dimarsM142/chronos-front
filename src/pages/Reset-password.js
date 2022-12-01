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
                setErrorText('Time is up. Try sending the data again.');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(postError.data.comment === 'Incorrect token!'){
                setErrorText('You have followed a bad link. Try sending the data again.');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else {
                router('/error');
            }
        }
    }, [postError]);

    function sendPass(e){
        e.preventDefault();
        clearInterval(curTimeoutID);
        if(dataInputed.password.length < 8){
            setErrorText('Enter a password longer than 8 characters');
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
                <p className="header">RESET PASSWORD</p>
                <div className="result-text">
                    <p className="main-text">Password changed successfully.</p>
                    <p className="second-text">Now you will automatically go to the account login page. Enter there your login and new password</p>
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
                    <p className="header">RESET PASSWORD</p>
                    <p className="loading-text">Data is being sent. Wait...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
                    :
                    <div className="resetForm">
                        <p className="header">RESET PASSWORD</p>
                        <p className="nameInput">new password:</p>
                        <MyInput 
                            type="password" 
                            placeholder="password" 
                            value={dataInputed.password} 
                            onChange={e => {
                                if(e.target.value.length > 32){
                                    clearTimeout(curTimeoutID);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText("The maximum length of your password is 32 characters");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    setCurTimeoutID(id);
                                    setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                }
                                else {
                                    setDataInputed({...dataInputed, password: e.target.value});
                                }
                            }}
                        />    
                        <MyButton type='submit' onClick={sendPass}>Send</MyButton>
                        {errorText && <p className="error">{errorText}</p>}
                        <p className="lastPartName">Got an error? Try sending again</p>
                        <div className="lastPart" >
                            <Link to="/forgot-password">Input login again</Link> 
                        </div>        
                    </div>   
                }
            </div>
        );
    }

}

export default PasswordReset;