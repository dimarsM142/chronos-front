import React, {useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import getNameEvent from "../components/getNameEvent";
import getNameMonth from "../components/getNameMonth";
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import { useNavigate } from "react-router-dom";
import CreateEvent from "../components/Create-event";
import { addActiveAction, addDateAction} from "../store/dateReducer";
import MyLoader from "../components/UI/MyLoader2";

import './Events.css';

function checkHours(index){
    switch (+index) {
        case 1:
            return 'годину';
        case 2:
            return 'години';
        case 3:
            return 'години';
        case 4:
            return 'години';
        default:
            return 'годин';
    }
}

const Event = (props) => {
    const dispatch = useDispatch();
    const router = useNavigate();   

    const [dataInputed, setDataInputed] = useState({id: +window.location.pathname.slice(window.location.pathname.indexOf('events/') + 7), title: '', description: '', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: ''});
    const [events, setEvents] = useState({id: null, title: '', description: '', date: new Date(), type: '', duration:null}); 
    const [modalActive, setModalActive] = useState(false);
    const [role, setRole] = useState('admin');
    const [deleteProfile, setDeleteProfile] = useState(false);
    const changePost = (e) =>{
        e.stopPropagation();
        setDataInputed({...dataInputed, id: events.id, title: events.title, description: events.description, hours: events.date.getHours().toString(), minutes: events.date.getMinutes().toString(), type: events.type, duration:events.duration.toString()});
        setModalActive(3);
    }
    const [fetchGetRole, isGetRole, getRoleError] = useFetching(async () => {
        const res = await PostService.getUserRole(
            localStorage.getItem('access'), 
            +window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events'))
        );

        if(res.data[0].role === 'owner' || res.data[0].role === 'admin'){
            setRole('admin');
        }
        else {
            setRole('user');
        }
    })
    const [fetchEvent, isEventLoading, eventError] = useFetching(async () => {
        const response = await PostService.getEvent(
            localStorage.getItem('access'), 
            +window.location.pathname.slice(window.location.pathname.indexOf('events/') + 7)
        );
        let updatedDate = new Date(response.data[0].execution_date);
        setEvents({id: response.data[0].id, title: response.data[0].title, description: response.data[0].description, date: updatedDate,  type: response.data[0].type,  duration:  Math.ceil((response.data[0].duration / 3600) * 100) / 100});
        dispatch(addDateAction(updatedDate.getTime()));
        dispatch(addActiveAction(updatedDate));
    })
    const [fetchChangeEvent, isChangeEventLoading, changeEventError] = useFetching(async () => {
        await PostService.changeEvent(
            localStorage.getItem('access'), 
            window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events')),
            dataInputed.id,
            dataInputed.title, 
            dataInputed.description,
            `${dataInputed.year}-${
            (dataInputed.month + 1).toString().length === 1 ? '0' + (dataInputed.month + 1) : (dataInputed.month + 1)}-${
            dataInputed.day.toString().length === 1 ? '0' + dataInputed.day : dataInputed.day} ${
            dataInputed.hours.toString().length === 1 ? '0' + dataInputed.hours : dataInputed.hours}:${
            dataInputed.minutes.toString().length === 1 ? '0' + dataInputed.minutes : dataInputed.minutes}:00.00`,
            dataInputed.type, 
            dataInputed.duration
        );
        fetchEvent();
    })
    console.log(dataInputed);
    const [fetchDeleteEvent, isDeleteEventLoading, deleteEventError] = useFetching(async () => {
        await PostService.deleteEvent(
            localStorage.getItem('access'), 
            window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events')),
            events.id
        );
        router('/calendars');
    })
    
    useEffect(()=>{
        fetchEvent();
        fetchGetRole();
    }, []);
    useEffect(()=>{
        if(deleteEventError || changeEventError || eventError || getRoleError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[deleteEventError, eventError, changeEventError, getRoleError]);

    if(isDeleteEventLoading || isEventLoading || isChangeEventLoading || isGetRole){
        return(
            <div className="loading-calendar">  
                <div className="loading-test">
                    <p>Відбувається завантаження даних. Зачекайте...</p>
                </div>
                <div className="loader-container">
                    <MyLoader />
                </div>
                <div className="fake-posts"></div>
                
            </div>
        );
    }
    else if(deleteProfile){
        return (
            <div className="event-container">
                <div className="user-info">
                    <p className="deleting-text">Ви впевнені що хочете видалити подію?</p>
                    <div className="buttons-delete">
                        <button className='stay' onClick={e=>{e.preventDefault(); setDeleteProfile(false)}}>Повернутись назад</button>
                        <button className="delete-profile" onClick={e=>{e.preventDefault(); fetchDeleteEvent()}}>Видалити подію</button>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="event-container">
                <div className={"one-event-small one-type-" + events.type}>
                    <p className="title">{events.title}</p>
                    <p className="description">{events.description}
                    </p>
                    <p className="type">{getNameEvent(events.type)}</p>
                    <div className="time">
                        <div className="time-time">
                            <p>{events.date.getHours().toString().length === 1 ? '0' + events.date.getHours() : events.date.getHours()}</p>
                            <p>:</p>
                            <p>{events.date.getMinutes().toString().length === 1 ? '0' + events.date.getMinutes() : events.date.getMinutes()}</p>
                        </div>
                        <p className="time-date">{events.date.getDate()} {getNameMonth(events.date.getMonth(), 0)} {events.date.getFullYear()} року</p>
                    </div>
                
                    {events.type === 'arrangement' 
                        ?
                        <div className="duration">
                            <p>Триває протягом {events.duration} {checkHours(events.duration)}</p>
                            
                        </div>
                        
                        :
                        <div className="duration"></div>
                    }
                
                    {events.date.getTime() > new Date().getTime()
                        ?
                        <div className="change"> 
                            {role === 'admin' && 
                                <div>
                                    <div className="edit">
                                        <button onClick={changePost}>Змінити подію</button>
                                    </div>
                                    <div className="delete">
                                        <button onClick={(e) => {e.stopPropagation(); setDeleteProfile(true)}}>Видалити подію</button>
                                    </div>  
                                </div>
                            }
                        </div> 
                        :
                        <div className="change"><div></div></div>
                    }
                </div>
                <CreateEvent 
                    modalActive={modalActive} 
                    setModalActive={setModalActive} 
                    fetchChangeEvent={fetchChangeEvent}
                    dataInputed={dataInputed}
                    setDataInputed={setDataInputed}
                    typeOfDuration={"Місяць"}
                />
            </div>
        );
    }
    
}

export default Event;
