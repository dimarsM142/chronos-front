import React from "react";
import { Link } from "react-router-dom";
import './Error.css'
const Error = () => {
    return (
        <div className="error-page">
            <p className="header">Помилка 404</p>
            <p className="error-text">Виникла помилка під час останньої вашої дії. Спробуйте ще раз</p>
            <div className="error-image">
                <img src='https://cdn-icons-png.flaticon.com/512/580/580185.png' alt='error'/>
            </div>
            <div className="error-posts">
                <Link to='/calendars'>Основна сторінка</Link>
            </div>
        </div>
    );
}

export default Error;