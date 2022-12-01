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
                    <li ><Link to="/calendars"><img className="logo" src='https://www.pngkey.com/png/full/18-180664_calendar-clock-comments-time-and-date-icon-png.png' alt='logo'/></Link></li>
                    <li className="rigth logout"><Link to="/login" onClick={logOut}>Log out</Link></li>
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