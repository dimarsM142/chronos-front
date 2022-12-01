import React from "react";
import { Link } from "react-router-dom";
import './Error.css'
const Error = () => {
    return (
        <div className="error-page">
            <p className="header">Error 404</p>
            <p className="error-text">An error occurred during your last action. Try again</p>
            <div className="error-image">
                <img src='https://cdn-icons-png.flaticon.com/512/580/580185.png' alt='error'/>
            </div>
            <div className="error-posts">
                <Link to='/calendars'>Main page</Link>
            </div>
        </div>
    );
}

export default Error;