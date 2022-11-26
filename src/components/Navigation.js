import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import './Navigation.css'
const Navigation = (props) => {
    const router = useNavigate();

    const logOut = (e) =>{
        e.preventDefault();
        window.localStorage.setItem('access', '');
        window.localStorage.setItem('refresh', '');
        window.localStorage.setItem('isAuth', 'false');
        window.localStorage.setItem('login', '');
        window.localStorage.setItem('ava', '');
        localStorage.setItem('role', '');
        props.clearRefresh();
        props.setAuth(false);
        setTimeout(()=>{
            router('/login');
        },400); 
        
    }
    if(props.auth){
        let loginLink = `/${localStorage.getItem('login')}/info`
        return (
            <nav className="up-nav">
                <ul>
                    <li><img className="logo" src='https://cdn-icons-png.flaticon.com/128/7540/7540143.png' alt='logo'/></li>
                    <li><Link to="/calendars">Основна</Link></li>
                    <li className="rigth logout"><Link to="/login" onClick={logOut}>Вийти</Link></li>
                    <li className="rigth account">
                        <Link to={loginLink} style={{position: 'relative'}}>
                            <p>{localStorage.getItem('login')}</p>
                            {localStorage.getItem('ava') !== '' &&
                                <img src={localStorage.getItem('ava')} alt='ava' />
                            }
                            
                        </Link>
                    </li>  
                </ul>
            </nav>
        );
    }
    else{
        return (
            <></>
        );
    }
   
}

export default Navigation;