import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import MyLoader from "../components/UI/MyLoader.js";
import './Admin-checkOneUser.css';

const User = () =>{
    const router = useNavigate();   
    const [user, setUser] = useState([]);
    const [isDeleting, setDeleting] = useState(false);
    const [fetchUsers, isUsersLoading, errorUsers] = useFetching(async () => {
        const response = await PostService.getUserByLogin(localStorage.getItem('access'), window.location.pathname.slice(window.location.pathname.indexOf('users/') + 6));
        setUser(response.data[0]);
    })
    const [fetchDeleteUser, isDeleteLoading, deleteUserError] = useFetching(async () => {
        await PostService.deleteUser(localStorage.getItem('access'), user.userID);
        setTimeout(()=>{
            router(`/admin/users`)
        },50)
    })

    useEffect(()=>{

        if(errorUsers || deleteUserError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorUsers, deleteUserError]);

    useEffect(()=>{
        fetchUsers();
    }, []);
    if(isUsersLoading || isDeleteLoading){
        return(
            <div className="user">
                <p className="header">КОРИСТУВАЧ</p>
                <p className="loading-text">Відбувається завантаження даних. Зачекайте...</p>
                <div className="loader">
                    <MyLoader />
                </div>
            </div>
        );
    }
    else if(isDeleting){
        return(
            <div className="user">
                <p className="header">КОРИСТУВАЧ</p>
                <p className="deleting-text">Ви впевнені що хочете видалити акаунт?</p>
                <div className="buttons-delete">
                    <button className='stay' onClick={e=>{e.preventDefault(); setDeleting(false)}}>Залишити акаунт</button>
                    <button className="delete-profile" onClick={e=>{e.preventDefault();fetchDeleteUser();}}>Видалити акаунт</button>
                </div>  
            </div>
        );
    }
    else{   
        return(
            <div className="user">
                <p className="header">КОРИСТУВАЧ</p>
                <div className="id-container">
                    <p className="title-id">id:</p>
                    <p className="content-id">{user.userID}</p>
                </div>
                <div className="ava">
                    <img src={user.picture} alt='ava'/>
                </div>
                <div className="container">
                    <p className="title">логін</p>
                    <p className="content">{user.login}</p>
                </div>
                <div className="container">
                    <p className="title">електронна пошта</p>
                    <p className="content">{user.email}</p>
                </div>
                <div className="container">
                    <p className="title">повне ім'я</p>
                    <p className="content">{user.fullName}</p>
                </div>
                <div className="container">
                    <p className="title">роль</p>
                    <p className="content">{user.role ==='user' ? 'користувач' : 'адміністратор'}</p>
                </div>
                <div className="container">
                    <p className="title">рейтинг</p>
                    <div className="user-rating">
                        <img src='https://cdn-icons-png.flaticon.com/128/3163/3163706.png' alt='txt' />
                        <p>{user.rating}</p>
                    </div>
                </div> 
                {user.role === 'user' &&
                    <div className="buttons-delete">
                        <button className='stay' onClick={e=>{e.preventDefault(); router(`/admin/change-user/${user.login}`)}}>Змінити акаунт</button>
                        <button className="delete-profile" onClick={e=>{e.preventDefault(); setDeleting(true);}}>Видалити акаунт</button>
                    </div> 
                }
                               
            </div>
        );
    }
}

export default User;