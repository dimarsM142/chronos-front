import React, { useEffect, useState} from "react";
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import { useNavigate } from "react-router-dom";
import MyInput from "../components/UI/MyInput.js";
import MyButton from "../components/UI/MyButton.js";
import MyLoader from "../components/UI/MyLoader.js";
import Select from "react-select";
import './Admin-changeAccount.css';

function checkEmail(email){
    let arrOfAt = email.match(/@/g);
    if(!arrOfAt || arrOfAt.length !== 1){
        return false;
    }
    if(!email.slice(email.indexOf('@') + 1) || email.slice(email.indexOf('@') + 1).indexOf('.') === -1|| email.slice(email.indexOf('@') + 1).indexOf('-') !== -1 || email.slice(email.indexOf('@') + 1).indexOf('_') !== -1){
        return false;
    }
    return true;
}


const ChangeUser = () => {
    const router = useNavigate();
    const [info, setInfo] = useState({});
    const [errorText, setErrorText] = useState('');
    const [errorPhoto, setErrorPhoto] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [successRes, setSuccessRes] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const [fetchUserInfo, isPostsLoading, userError] = useFetching(async () => {
        const response = await PostService.getUserByLogin(localStorage.getItem('access'), window.location.pathname.slice(window.location.pathname.indexOf('change-user/') + 12));
        setInfo(response.data[0]);
    })
    const [fetchChangeUser, isChangeLoading, changeUserError] = useFetching(async () => {
        await PostService.changeUserInfoAdmin(localStorage.getItem('access'), info);
        
        setSuccessRes(true);
        setTimeout(()=>{
            router(`/calendars`)
        }, 3000);
    })

    const [fetchChangeAva, isChangeAvaLoading, errorAvaChange] = useFetching(async () => {
        await PostService.changeUserAvatar(localStorage.getItem('access'), info.userID,selectedFile);
        setSuccessRes(true);
        setTimeout(()=>{
            router(`/calendars`)
        }, 3000);
        
    })

    useEffect(() =>{
        fetchUserInfo();
    }, []);

    useEffect(()=>{
        if(changeUserError){
            
            if(changeUserError.data.message && changeUserError.data.message.sqlMessage && changeUserError.data.message.sqlMessage.includes("for key 'users.email'")){
                setErrorText('Дана пошта вже зареєстрована. Спробуйте іншу');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(changeUserError.data.message && changeUserError.data.message.sqlMessage && changeUserError.data.message.sqlMessage.includes("for key 'users.login'")){
                setErrorText('Даний логін вже існує. Спробуйте інший');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else {
                setTimeout(()=>{router(`/error`)},50)
            }
        }
        if(errorAvaChange || userError) {
            setTimeout(()=>{router(`/error`)},50)
        }
    },[changeUserError, errorAvaChange, userError]);

    function changeData(e){
        e.preventDefault();
        clearTimeout(curTimeoutID);
        
        if(!info.login){
            setErrorText('Введіть логін');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!checkEmail(info.email)){
            setErrorText('Введіть існуючу адресу');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!info.fullName){
            setErrorText("Введіть правильно ваше ім'я");
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else {
            fetchChangeUser();
        }       
        
    }

    function changeHandler(e){
        clearTimeout(curTimeoutID);
        e.preventDefault();
        if(e.target.files[0].type.indexOf('image')=== -1){
            setIsFilePicked(false);
            setErrorPhoto('Неправильний тип файлу');
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
            setErrorPhoto('Фото не обрано');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            setCurTimeoutID(id);
        }
    }
    if(isPostsLoading || isChangeAvaLoading || isChangeLoading){
        return (
            <div>
                <div className="user">
                    <p className="header">Зміна акаунту</p>
                    <p className="loading-text">Відбувається надсилання або завантаження даних. Зачекайте...</p>
                    <div className="loader">
                        <MyLoader />
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
                    <div className="user">
                        <p className="header">Зміна акаунту</p>
                        <div className="result-text">
                            <p className="main-text">Дані акаунту успішно змінені.</p>
                            <p className="second-text">Зараз вас буде перенаправлено на основну сторінку.</p>
                        </div> 
                    </div>
                    :
                    <div className="user">
                        <p className="header">Зміна акаунту</p>
                        <p className="user-title">Зміна фото профілю</p>
                        <div className="user-photo">
                            <img src={info.picture} alt="ava" className="ava-current"/>
                            <div className="input-container">
                                <input type="file" name="file" id='input-file' className="input-file" onChange={changeHandler} />
                                <label htmlFor="input-file" className="input-file-desc">
                                    <span className="input-file-icon">
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                    </span>
                                    {isFilePicked
                                        ?
                                        <span className="input-file-text">Фото обрано</span>
                                        :
                                        <span className="input-file-text">Обрати фото</span>
                                    }
                                    
                                </label>
                            </div>
                            <MyButton onClick={handleSubmission}>Змінити фото</MyButton>
                            
                        </div>
                        {errorPhoto && <p className="error">{errorPhoto}</p>}
                        <p className="user-title">Зміна даних акаунту</p>
                        <div className="user-data">
                            <p className="user-name">логін:</p>
                            <MyInput 
                                type="text"
                                placeholder="логін" 
                                value={info.login} 
                                onChange={e => {                                    
                                    if(e.target.value.length - info.login.length < 0){
                                        setInfo({...info, login: e.target.value});
                                    }
                                    else if(e.target.value.length > 20){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("Максимальна довжина вашого логіна 20 символів");
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
                                        setErrorText("Ви не можете ввести пробіли для вашого логіна а також ці символи: \\ / | ? : * " + '"' + " ' ` , ~ < > ");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-name">електронна пошта:</p>
                            <MyInput 
                                type="text"
                                placeholder="пошта" 
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
                                        setErrorText("Дозволені символи для вводу електронної пошти: a-z, 0-9, _, -, .");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-name">повне ім'я:</p>
                            <MyInput 
                                type="text"
                                placeholder="повне ім'я" 
                                value={info.fullName} 
                                onChange={e => {
                                    if(e.target.value.length - info.fullName.length < 0){
                                        setInfo({...info, fullName: e.target.value});
                                    }
                                    else if(e.target.value.length > 42){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("Максимальна довжина вашого ім'я 42 символів");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[/|\\"'`]/)) {
                                        setInfo({...info, fullName: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("Ви не можете ввести для вашого іменці ці символи: \\ / | " + '"' + " ' `");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-name">роль:</p>
                            <Select 
                                className='select-create' 
                                name="roles" 
                                defaultValue={{value: 'user', label: 'Користувач'}}
                                isClearable={false}
                                isSearchable={false}
                                placeholder='Категорії'
                                options={[{value: 'user', label: 'Користувач'}, {value: 'admin', label: 'Адміністратор'}]}
                                onChange={(e)=>{setInfo({...info, role: e.value});}} 
                                theme={theme => ({
                                    ...theme,
                                    colors: {
                                        primary: 'green',
                                        primary25: 'green',
                                        neutral0: '#FFFFFF',
                                        neutral10: 'rgba(0, 0, 0, 0.2)',
                                        neutral20: 'rgba(0, 0, 0, 0.5)',
                                        neutral30: 'rgba(0, 0, 0, 0.3)',
                                        neutral40: 'rgb(0, 125, 0)',
                                        neutral50: 'rgba(0, 0, 0, 0.7)',
                                        neutral80: 'green',
                                        danger: 'red',
                                        dangerLight: 'rgba(255, 0, 0, 0.2)',
                                    }
                                    
                                })}
                            />
                            <MyButton onClick={changeData}>Змінити</MyButton>
                        </div>
                        {errorText && <p className="error">{errorText}</p>}
                    </div>
                }
            </div>
        );
    }
   
}

export default ChangeUser;