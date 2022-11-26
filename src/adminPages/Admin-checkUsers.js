import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OneUser from "./one-user.js";
import MyLoader from "../components/UI/MyLoader2.js";
import MySearch from "../components/UI/MySearch.js";
import './Admin-checkUsers.css';

const Users = () => {

    const router = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [name, setName] = useState('');
    const [fetchUsers, isUsersLoading, errorUsers] = useFetching(async () => {
        const response = await PostService.getUsers(localStorage.getItem('access'));
        if(!response.data.message){
            setUsers(response.data);
            setSelectedUsers(response.data);
        }
        else{ 
            setUsers('0 users');
            setSelectedUsers('0 users');
        }
    })

    useEffect(()=>{

        if(errorUsers){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorUsers]);

   

    useEffect(()=>{
        fetchUsers();
    }, []);
    
    function searchFoo(){
        if(name.length === 0){
            setSelectedUsers(users);
        }
        else{
            let temArpp = [];
            for(let i = 0; i < users.length; i++) {
                if(users[i].login.toLowerCase().includes(name.toLowerCase()) || users[i].fullName.toLowerCase().includes(name.toLowerCase()) || users[i].email.toLowerCase().includes(name.toLowerCase())){
                    temArpp.push(users[i]); 
                }
            }
            if(temArpp.length > 0){ 
                setSelectedUsers(temArpp)
            }
            else {
                setSelectedUsers('0 users');
            }     
        }
    }

    return (
        <div>
            {isUsersLoading 
                ?
                <div className="loading-posts">
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="loading-test">
                        <p>Відбувається завантаження даних. Зачекайте..</p>
                    </div>
                    <div className="loader-container">
                        <MyLoader />
                    </div>
                </div>
                :
                <div className="all-users">
                    <div className="creating-user">
                        <Link to='/admin/create-user'>Створити нового користувача</Link>
                    </div>
                    {selectedUsers === '0 users'
                        ?
                            <div>
                                {users !== '0 users' &&
                                    <div className="search-container">
                                        <MySearch placeholder={"Введіть логін або ім'я користувача, якого ви хочете знайти"} value={name} onChange={e=> setName(e.target.value)} onClickSearch={searchFoo}/>
                                    </div>
                                }
                                <p className="no-users">Відсутні користувачі, які відповідають заданим критеріям :(</p>
                            </div>
                        :
                        <div>
                            <div className="search-container">
                                <MySearch placeholder={"Введіть логін або ім'я користувача, якого ви хочете знайти"} value={name} onChange={e=> setName(e.target.value)} onClickSearch={searchFoo}/>
                            </div>
                            <div className="user-container">
                                {selectedUsers.map((user) =><OneUser user={user} key={user.userID}/>)}
                            </div>
                        </div>
                    }
                </div> 
            }
        </div>   
    );
}

export default Users;