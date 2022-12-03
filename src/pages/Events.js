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
            return 'hour';
        default:
            return 'hours';
    }
}

const Event = (props) => {
    const dispatch = useDispatch();
    const router = useNavigate();   
    const [users, setUsers] = useState([]);
    const [dataInputed, setDataInputed] = useState({id: +window.location.pathname.slice(window.location.pathname.indexOf('events/') + 7), title: '', description: '', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: '', users: [], category: 'work'});
    const [events, setEvents] = useState({id: null, title: '', description: '', date: new Date(), type: '', duration:null, category: 'work', author: '', color: ''}); 
    const [modalActive, setModalActive] = useState(false);
    const [role, setRole] = useState('admin');
    const [isOwner, setIsOwner] = useState(false);
    const [deleteProfile, setDeleteProfile] = useState(false);
    const changePost = (e) =>{
        e.stopPropagation();
        setDataInputed({...dataInputed, id: events.id, title: events.title, description: events.description, hours: events.date.getHours().toString(), minutes: events.date.getMinutes().toString(), type: events.type, duration:events.duration.toString(), users: [{id: 0, login: ''}], category: events.category, color: events.color});
        setModalActive(3);
    }
    const [fetchGetRole, isGetRole, getRoleError] = useFetching(async () => {
        const res = await PostService.getUserRole(
            localStorage.getItem('access'), 
            +window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events'))
        );
        if(res.data[0].role === 'owner'){
            setIsOwner(true);
        }
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
        setEvents({id: response.data[0].id, title: response.data[0].title, description: response.data[0].description, date: updatedDate,  type: response.data[0].type, duration: Math.ceil((response.data[0].duration / 3600) * 100) / 100, category: response.data[0].category, author: response.data[0].login, color: response.data[0].color});
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
            dataInputed.duration,
            dataInputed.category,
            dataInputed.users.join(','),
            dataInputed.color
        );
        fetchEvent();
        fetchGetSubscribedUser();
    })
    const [fetchDeleteEvent, isDeleteEventLoading, deleteEventError] = useFetching(async () => {
        await PostService.deleteEvent(
            localStorage.getItem('access'), 
            window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events')),
            events.id
        );
        router('/calendars');
    })
    const [fetchGetSubscribedUser, isGetUserSubscribe, getSubscribeUserError] = useFetching(async () => {
        if(events.type === 'arrangement'){
            const res = await PostService.getAllUsersInvitedToEvent(
                localStorage.getItem('access'), 
                window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events')),
                events.id
            );
            setUsers(res.data);
        }
        else if(events.type == 'reminder' || events.type == 'task'){
            const res = await PostService.getAllUsersToCalendar(
                localStorage.getItem('access'), 
                window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events'))
            );
            console.log(res);
            setUsers(res.data);
        }   
        
    })
    useEffect(()=>{
        fetchEvent();
        fetchGetRole();
    }, []);

    useEffect(()=>{
        fetchGetSubscribedUser();
    }, [events.type])
    useEffect(()=>{
        if(deleteEventError || changeEventError || eventError || getRoleError || getSubscribeUserError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[deleteEventError, eventError, changeEventError, getRoleError, getSubscribeUserError]);

    if(isDeleteEventLoading || isEventLoading || isChangeEventLoading || isGetRole || isGetUserSubscribe){
        return(
            <div className="loading-calendar">  
                <div className="loading-test">
                    <p>Data is being loaded. Wait...</p>
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
                    <p className="deleting-text">Are you sure you want to delete the event?</p>
                    <div className="buttons-delete">
                        <button className='stay' onClick={e=>{e.preventDefault(); setDeleteProfile(false)}}>Go back</button>
                        <button className="delete-profile" onClick={e=>{e.preventDefault(); fetchDeleteEvent()}}>Delete event</button>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="event-container">
                <div className={"one-event-small one-type-" + events.color}>
                    
                    <p className="title">{events.title}</p>
                    <div className="category">
                        <p className="category-title">category:</p>
                        <p className="category-content">{events.category}</p>
                    </div>
                    <div className="author">
                        <p className="author-title">author:</p>
                        <p className="author-content">{events.author}</p>
                    </div>
                    <p className="description">{events.description}</p>
                    <p className="type">{getNameEvent(events.type)}</p>
                    <div className="time">
                        <div className="time-time">
                            <p>{events.date.getHours().toString().length === 1 ? '0' + events.date.getHours() : events.date.getHours()}</p>
                            <p>:</p>
                            <p>{events.date.getMinutes().toString().length === 1 ? '0' + events.date.getMinutes() : events.date.getMinutes()}</p>
                        </div>
                        <p className="time-date">{getNameMonth(events.date.getMonth(), 0)} {events.date.getDate()}, {events.date.getFullYear()}</p>
                    </div>
                
                    {events.type === 'arrangement' 
                        ?
                        <div className="duration">
                            <p>Lasts {events.duration} {checkHours(events.duration)}</p>
                            
                        </div>
                        
                        :
                        <div className="duration"></div>
                    }
                    <div className="users-container">
                        
                        {users.length === 0
                            ?
                            <p className="no-users">There are no subscribers :(</p>
                            :
                            <div>
                                <p className="title-users">Subscribers</p>
                                <div className="users-content-container">
                                    {users.filter(user => user.login !== events.author).map(user => 
                                        <div key={user.user_id ? user.user_id : user.id} className='one-user-container'>
                                            <p className='one-user-login'>{user.login}</p>
                                            <p className='one-user-role'>{user.role ? user.role : 'user'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        
                    </div>
                    {events.date.getTime() > new Date().getTime()
                        ?
                        <div className="change"> 
                            {role === 'admin' && 
                                <>
                                    {events.type === 'arrangement'
                                        ?
                                        <>
                                            {events.author === localStorage.getItem('login') ?
                                                <div>
                                                    <div className="edit">
                                                        <button onClick={changePost}>Change event</button>
                                                    </div>
                                                    <div className="delete">
                                                        <button onClick={(e) => {e.stopPropagation(); setDeleteProfile(true)}}>Delete event</button>
                                                    </div>  
                                                </div>
                                                :
                                                <>
                                                    {isOwner &&
                                                        <div>
                                                            <div className="delete">
                                                                <button onClick={(e) => {e.stopPropagation(); setDeleteProfile(true)}}>Delete event</button>
                                                            </div>  
                                                        </div>
                                                    }
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <div>
                                                <div className="edit">
                                                    <button onClick={changePost}>Change event</button>
                                                </div>
                                                <div className="delete">
                                                    <button onClick={(e) => {e.stopPropagation(); setDeleteProfile(true)}}>Delete event</button>
                                                </div>  
                                            </div>
                                        </>
                                    }
                                </>
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
                    typeOfDuration={"Month"}
                    typeOfEvent="oneEvent"
                />
            </div>
        );
    }
    
}

export default Event;
