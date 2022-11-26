import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import './One-calendar.css';

const OneCalendar = (props) => {
    const router = useNavigate();

    const [fetchChangeCalendar, isChangeCalendarLoading, changeCalendarError] = useFetching(async () => {
        const response = await PostService.deleteCalendar(localStorage.getItem('access'), props.calendar.id, pr);
        props.fetchCalendars();
    })
    const [fetchDeleteCalendar, isDeleteCalendarLoading, deleteCalendarError] = useFetching(async () => {
        const response = await PostService.deleteCalendar(localStorage.getItem('access'), props.calendar.id);
        props.fetchCalendars();
    })
    const [fetchUnsubscribeCalendar, isUnsubscribeCalendarLoading, unsubscribeCalendarError] = useFetching(async () => {
        await PostService.unsubscribeUserFromCalendar(localStorage.getItem('access'), props.calendar.id, 0);
        props.fetchCalendarsSubscribed();

    })

    const deleteCalendar = (e) =>{
        e.stopPropagation();
        if(props.typeOfCalendars.value === 'own'){
            fetchDeleteCalendar();
        }
        else{
            fetchUnsubscribeCalendar();
        }
    }
    useEffect(()=>{

        if(deleteCalendarError || unsubscribeCalendarError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[deleteCalendarError, unsubscribeCalendarError]);

    //////////////////////////////////////////////////////////////////////////////////////


        return (
            <>
                {props.typeOfCalendars.value === 'own'
                    ?
                    <div className="one-calendar-small" onClick={()=>{router(`/calendars/${props.calendar.id}`)}}>
                        <div className="up-part">
                            <div className="title"> <p >{props.calendar.title}</p></div>
                            <div className="description"> <p>{props.calendar.description}</p></div>
                            
                            <div className="change">
                                <i className="fa fa-pencil" aria-hidden="true" onClick={e => {e.stopPropagation(); props.setModalActive(2); props.setDataInputed({title: props.calendar.title, description:props.calendar.description, id: props.calendar.id})}}></i>
                                <i className="fa fa-times" aria-hidden="true" onClick={deleteCalendar}></i>
                            </div>
                        </div>
                        <div className="users">
                            <i className="fa fa-users" aria-hidden="true" onClick={e => {e.stopPropagation(); props.setCheckAllSubsedUsers(true); props.fetchGetSubscribedUser(props.calendar.id); props.setCalendarCreate({title:props.calendar.title,id:props.calendar.id})}}></i>
                            <i className="fa fa-user-plus" aria-hidden="true" onClick={e => {e.stopPropagation(); props.setShowInputForSubsUser(true);props.setCalendarCreate({title:props.calendar.title,id:props.calendar.id})}}></i>
                        </div>
                    </div>
                    :
                    <div className="one-calendar-small-subscribed" onClick={()=>{router(`/calendars/${props.calendar.id}`)}}>
                        <p className="title">{props.calendar.title}</p>
                        <p className="description">{props.calendar.description}</p>
                        <div className="delete">
                            <i className="fa fa-times" aria-hidden="true" onClick={deleteCalendar}></i>
                        </div>
                    </div>
                } 
                
            </>
        );
}

export default OneCalendar;
