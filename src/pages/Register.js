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
                setError('Даний логін вже існує. Спробуйте інший');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);// eslint-disable-next-line
            }
            else if(postError.data.comment === "A user with this email already exists!"){
                setError('Дана пошта вже зареєстрована. Спробуйте інший');
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
        if(dataInputed.login.length <= 4){
            setError('Введіть логін більше 4 символів');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(dataInputed.password !== dataInputed.passwordConfirmation){
            setError('Паролі не співпадають');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(dataInputed.password.length < 8){
            setError('Введіть пароль довжиною більше 8 символів');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!checkEmail(dataInputed.email)){
            setError('Введіть існуючу адресу');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!dataInputed.fullName || dataInputed.fullName.length <= 8){
            setError("Введіть ваше ім'я довше 8 символів");
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
                    <p className="header">РЕЄСТРАЦІЯ</p>
                    <p className="loading-text">Відбувається надсилання даних. Зачекайте...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
                :
                <div>
                    {error === 'success' 
                        ?
                        <div className="registerForm">
                            <p className="header">РЕЄСТРАЦІЯ</p>
                            <div className="result-text">
                                <p className="main-text">Акаунт успішно зареєстрований.</p>
                                <p className="second-text">Тепер ви можете ввійти в свій акаунт.</p>
                            </div> 
                        </div>
                        :
                        <div className="registerForm">
                            <p className="header">РЕЄСТРАЦІЯ</p>
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
                                        setError("Максимальна довжина вашого логіна 20 символів");
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
                                        setError("Ви не можете ввести пробіли для вашого логіна а також ці символи: \\ / | : * " + '"' + " ' ` , ~ < > ");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            />
                            <p className="nameInput">пароль:</p>
                            <MyInput 
                                type="password" 
                                placeholder="пароль" 
                                value={dataInputed.password} 
                                onChange={e => {
                                    if(e.target.value.length > 32){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("Максимальна довжина вашого пароля 32 символи");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else {
                                        setDataInputed({...dataInputed, password: e.target.value});
                                    }
                                }}
                            />
                            <p className="nameInput">підтвердження пароля:</p>
                            <MyInput 
                                type="password"
                                placeholder="підтвердіть пароль" 
                                value={dataInputed.passwordConfirmation} 
                                onChange={e => { 
                                    if(e.target.value.length > 32){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("Максимальна довжина вашого пароля 32 символи");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else {
                                        setDataInputed({...dataInputed, passwordConfirmation: e.target.value});
                                    }
                                    
                                }}
                            />
                            <p className="nameInput">електронна пошта:</p>
                            <MyInput 
                                type="text" 
                                placeholder="пошта" 
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
                                        setError("Дозволені символи для вводу електронної пошти: a-z, 0-9, _, -, .");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                }}
                            />
                            <p className="nameInput">повне ім'я:</p>
                            <MyInput 
                                type="text" 
                                placeholder="повне ім'я" 
                                value={dataInputed.fullName} 
                                onChange={e => {
                                    if(e.target.value.length - dataInputed.fullName.length < 0){
                                        setDataInputed({...dataInputed, fullName: e.target.value});
                                    }
                                    else if(e.target.value.length > 42){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setError("Максимальна довжина вашого ім'я 42 символів");
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
                                        setError("Ви не можете ввести для вашого іменці ці символи: \\ / | " + '"' + " ' `");
                                        const id = setTimeout(()=>{setError('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            />
                            <MyButton type='submit' onClick={sendPass}>Зареєструватися</MyButton>
                            {error && <p className="error">{error}</p>}       
                            <p className="lastPartName">Вже маєте акаунт?</p>
                            <div className="lastPart">
                                <Link to="/login">Зайти в акаунт</Link>
                            </div>
                            
                        </div>   
                    }
                   
                </div>
            }

            
        </div>
    );
}

export default Register;