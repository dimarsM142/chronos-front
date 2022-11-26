import React from "react";
import { useNavigate } from "react-router-dom";
import './One-calendar.css';

const OneMainCalendar = (props) => {
    const router = useNavigate();

    return (
        <>
            <div className="one-calendar-small" onClick={()=>{router(`/calendars/main`)}}>
                <div className="up-part">
                    <div className="title"> <p >{props.calendar.title}</p></div>
                    <div className="description"> <p>{props.calendar.description}</p></div>
                </div>
            </div>
        </>
    );
}

export default OneMainCalendar;