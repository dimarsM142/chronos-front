import React, { useEffect, useState} from "react";
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import { useNavigate, Link } from "react-router-dom";
import MyInput from "../components/UI/MyInput.js";
import MyButton from "../components/UI/MyButton.js";
import MyLoader from "../components/UI/MyLoader.js";
import './User-info.css';

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


const UserInfo = (props) => {
    const router = useNavigate();
    const [info, setInfo] = useState({});
    const [pictureLink, setPictureLink] = useState({});
    const [errorText, setErrorText] = useState('');
    const [errorPhoto, setErrorPhoto] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [successRes, setSuccessRes] = useState(false);
    const [deleteProfile, setDeleteProfile] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const [fetchUserAva, isAvatarLoading, avatarError] = useFetching(async () => {
        const response = await PostService.getUserAvatar(localStorage.getItem('access'));
        setPictureLink(response.data.picture);
        if(response.data.picture !== localStorage.getItem('ava')){
            localStorage.setItem('ava', response.data.picture);
            window.location.reload();
        }
    })
    const [fetchUserInfo, isPostsLoading, userError] = useFetching(async () => {
        const response = await PostService.getUserInfo(localStorage.getItem('access'));
        if(window.location.href !== `/${localStorage.getItem('login')}/info`){
            router(`/${localStorage.getItem('login')}/info`);
        }
        setInfo(response.data[0]);
    })
    const [fetchChangeUser, isChangeLoading, changeUserError] = useFetching(async () => {
        await PostService.changeUserInfo(localStorage.getItem('access'), info);
        localStorage.setItem('login', info.login);
        setSuccessRes(true);
        setTimeout(()=>{
            router(`/calendars`)
        }, 3000);
    })

    const [fetchDeleteUser, , deleteUserError] = useFetching(async () => {
        await PostService.deleteUserInfo(localStorage.getItem('access'), info);
        localStorage.setItem('login', '');
        localStorage.setItem('isAuth', 'false');
        localStorage.setItem('access', '');
        localStorage.setItem('refresh', '');
        localStorage.setItem('role', '');
        props.clearRefresh();
        props.setAuth(false);
        setTimeout(()=>{
            router(`/login`)
        },50)
    })
    const [fetchChangeAva, isChangeAvaLoading, errorAvaChange] = useFetching(async () => {
        await PostService.patchUserAvatar(localStorage.getItem('access'), selectedFile);
        fetchUserAva();
        
    })

    useEffect(() =>{
        fetchUserInfo();
        fetchUserAva();
    }, []);

    useEffect(()=>{
        if(userError){
            localStorage.setItem('isAuth', 'false');
            localStorage.setItem('access', '');
            localStorage.setItem('refresh', '');
            localStorage.setItem('role', '');
            props.clearRefresh();
            props.setAuth(false);
            setTimeout(()=>{
                router(`/login`)
            },50)
        }
        else if(avatarError){
            localStorage.setItem('isAuth', 'false');
            localStorage.setItem('access', '');
            localStorage.setItem('refresh', '');
            localStorage.setItem('role', '');
            props.clearRefresh();
            props.setAuth(false);
            setTimeout(()=>{
                router(`/login`)
            },50)
        }
    }, [avatarError, userError])
    

    useEffect(()=>{
        if(changeUserError){
            
            if(changeUserError.data.message && changeUserError.data.message.sqlMessage && changeUserError.data.message.sqlMessage.includes("for key 'users.email'")){
                setErrorText('This mail is already registered. Try another one');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(changeUserError.data.message && changeUserError.data.message.sqlMessage && changeUserError.data.message.sqlMessage.includes("for key 'users.login'")){
                setErrorText('This login already exists. Try another one');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else {
                setTimeout(()=>{router(`/error`)},50)
            }
        }
        if(deleteUserError || errorAvaChange) {
            setTimeout(()=>{router(`/error`)},50)
        }
    },[changeUserError, deleteUserError, errorAvaChange]);

    function changeData(e){
        clearInterval(curTimeoutID);
        e.preventDefault();
        clearTimeout(curTimeoutID);
        e.preventDefault();
        if(info.login.length < 4){
            setErrorText('Enter a login that is longer than 4 characters');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!checkEmail(info.email)){
            setErrorText('Enter an existing email');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(info.full_name.length <= 8){
            setErrorText("Enter your name, which is longer than 8 characters");
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else {
            fetchChangeUser();
        }       
        
    }

    function deleteYourAccount(e){
        e.preventDefault();
        setDeleteProfile(true);
    }


    function changeHandler(e){
        clearTimeout(curTimeoutID);
        e.preventDefault();
        if(e.target.files[0].type.indexOf('image')=== -1){
            setIsFilePicked(false);
            setErrorPhoto('Invalid file type');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            setCurTimeoutID(id);
        }
        else{
            setSelectedFile(e.target.files[0]);
            setIsFilePicked(true);

        }
    }
    function handleSubmission(e){
        e.preventDefault();
        if(isFilePicked){
            fetchChangeAva();
        }
        else{
            setErrorPhoto('No photo selected');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            setCurTimeoutID(id);
        }
    }
    if(isPostsLoading || isAvatarLoading || isChangeAvaLoading || isChangeLoading){
        return (
            <div>
                <div className="user-info">
                    <p className="header">Account change</p>
                    <p className="loading-text">Data is being sent or downloaded. Wait...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
            </div>
        );
    }
    else if(deleteProfile){
        return (
            <div>
                <div className="user-info">
                    <p className="header">Account change</p>
                    <p className="deleting-text">Are you sure you want to delete the account?</p>
                    <div className="buttons-delete">
                        <button className='stay' onClick={e=>{e.preventDefault(); setDeleteProfile(false)}}>Go back</button>
                        <button className="delete-profile" onClick={e=>{e.preventDefault(); fetchDeleteUser();}}>Delete account</button>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div>
                {successRes 
                    ?
                    <div className="user-info">
                        <p className="header">Account change</p>
                        <div className="result-text">
                            <p className="main-text">Account details have been successfully changed.</p>
                            <p className="second-text">You will now be redirected to the main page.</p>
                        </div> 
                    </div>
                    :
                    <div className="user-info">
                        <p className="header">Account change</p>
                        <p className="user-info-title">Change profile photo</p>
                        <div className="user-photo">
                            <img src={pictureLink} alt="ava" className="ava-current"/>
                            <div className="input-container">
                                <input type="file" name="file" id='input-file' className="input-file" onChange={changeHandler} />
                                <label htmlFor="input-file" className="input-file-desc">
                                    <span className="input-file-icon">
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                    </span>
                                    {isFilePicked
                                        ?
                                        <span className="input-file-text">Avatar selected</span>
                                        :
                                        <span className="input-file-text">Select an avatar</span>
                                    }
                                    
                                </label>
                            </div>
                            <MyButton onClick={handleSubmission}>Upload an avatar</MyButton>
                            
                        </div>
                        {errorPhoto && <p className="error">{errorPhoto}</p>}
                        <p className="user-info-title">Changing account data</p>
                        <div className="user-data">
                            <p className="user-info-name">login:</p>
                            <MyInput 
                                type="text"
                                placeholder="login" 
                                value={info.login} 
                                onChange={e => {                                    
                                    if(e.target.value.length - info.login.length < 0){
                                        setInfo({...info, login: e.target.value});
                                    }
                                    else if(e.target.value.length > 20){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("The maximum length of your login is 20 characters");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[\s<>/|\\?:*"'`~,]/)) {
                                        setInfo({...info, login: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("You cannot enter spaces for your login and these characters: \\ / | ? : * " + '"' + " ' ` , ~ < > ");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-info-name">email:</p>
                            <MyInput 
                                type="text"
                                placeholder="email" 
                                value={info.email} 
                                onChange={e => { 
                                    if(e.target.value.length - info.email.length < 0){
                                        setInfo({...info, email: e.target.value})
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[^a-z_\-.@0-9]/)) {
                                        setInfo({...info, email: e.target.value})
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("Allowed characters for email input: a-z, 0-9, _, -, .");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-info-name">full name:</p>
                            <MyInput 
                                type="text"
                                placeholder="full name" 
                                value={info.full_name} 
                                onChange={e => {
                                    if(e.target.value.length - info.full_name.length < 0){
                                        setInfo({...info, full_name: e.target.value});
                                    }
                                    else if(e.target.value.length > 42){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("The maximum length of your name is 42 characters");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[/|\\"'`]/)) {
                                        setInfo({...info, full_name: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("You cannot enter these characters for your name: \\ / | " + '"' + " ' `");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            /> 
                            <MyButton onClick={changeData}>Change</MyButton>
                        </div>
                        {errorText && <p className="error">{errorText}</p>}
                        
                        <div className="delete-button-container">
                            <button onClick={deleteYourAccount}>Delete account</button>
                        </div>
                    </div>
                }
            </div>
        );
    }
   
}

export default UserInfo;