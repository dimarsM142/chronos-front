import React from "react";
import {useNavigate} from 'react-router-dom';

import './one-user.css';

const OneUser = (props) =>{
    const router = useNavigate();   
    
    return(
        <div className="one-user" onClick={()=>{router(`/admin/users/${props.user.login}`)}}>
            
            <div className="id-container">
                <p className="title-id">id:</p>
                <p className="content-id">{props.user.userID}</p>
            </div>
            <div className="ava">
                <img src={props.user.picture} alt='ava'/>
            </div>
            <div className="container">
                <p className="title">логін</p>
                <p className="content">{props.user.login}</p>
            </div>
            <div className="container">
                <p className="title">електронна пошта</p>
                <p className="content">{props.user.email}</p>
            </div>
            <div className="container">
                <p className="title">повне ім'я</p>
                <p className="content">{props.user.fullName}</p>
            </div>
            <div className="container">
                <p className="title">роль</p>
                <p className="content">{props.user.role ==='user' ? 'користувач' : 'адміністратор'}</p>
            </div>
            <div className="container">
                <p className="title">рейтинг</p>
                <div className="user-rating">
                    <img src='https://cdn-icons-png.flaticon.com/128/3163/3163706.png' alt='txt' />
                    <p>{props.user.rating}</p>
                </div>
            </div>                 
        </div>
    );
}

export default OneUser;