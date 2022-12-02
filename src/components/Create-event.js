import Modal from "./Modal/Modal";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyInput from "../components/UI/MyInput";
import MyButton from '../components/UI/MyButton';
import Select from 'react-select';
import getNameEvent from "./getNameEvent";
import getNameMonth from "./getNameMonth";
import './Create-event.css';
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import uk from 'date-fns/locale/uk';
import MyLoader from "./UI/MyLoader";
import "react-datepicker/dist/react-datepicker.css";

registerLocale('uk', uk);


const CreateEvent = (props) => {
    const router = useNavigate();
    const [users, setUsers] = useState([{value: '', label: ''}]);
    const [startSelectedUsers, setStartSelectedUsers] = useState([{value: '', label: ''}]);
    const activeDate = useSelector( (state) => state.cash.activeDate);
    const [error, setError] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [isDatePicked, setIsDatePicked] = useState(false);

    const [fetchGetSubscribedUser, isGetUserSubscribe, getSubscribeUserError] = useFetching(async () => {
        
        const res = await PostService.getAllUsersToCalendar(
            localStorage.getItem('access'), 
            props.typeOfEvent === 'oneEvent' ? window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events')) : +window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10)    
        );
        let tempArr = [];
        for(let i = 0; i < res.data.length; i++){
            if(localStorage.getItem('login') !== res.data[i].login){
                tempArr.push({value: res.data[i].user_id, label: res.data[i].login});
            }
        }
        setUsers(tempArr);
    })
    const [fetchGetSubscribedUserToEvent, isGetUserSubscribeToEventLoading, getSubscribeUserToEventError] = useFetching(async () => {
    
        const res = await PostService.getAllUsersInvitedToEvent(
            localStorage.getItem('access'), 
            props.typeOfEvent === 'oneEvent' ? window.location.pathname.slice(+window.location.pathname.indexOf('calendars/') + 10, window.location.pathname.indexOf('/events')) : +window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10),    
            props.dataInputed.id
        );
        if(res.data.length !== 0){
            let tempArr = [];
            let tempArrValues = [];
            for(let i = 0; i < res.data.length; i++){
                tempArr.push({value: res.data[i].id, label: res.data[i].login});
                tempArrValues.push(res.data[i].id);
            }
            setStartSelectedUsers(tempArr);          
            props.setDataInputed({...props.dataInputed, year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate(), users: tempArrValues});     
        }
        else{
            props.setDataInputed({...props.dataInputed, year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate(), users: []});     
        }
  
    })
  
    useEffect(()=>{
        if(props.modalActive === 1){
            if(props.typeOfDuration === 'Week'){
                props.setDataInputed({...props.dataInputed, hours: activeDate.getHours(),  minutes: '00', year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate()});
            }
            else{
                props.setDataInputed({...props.dataInputed, year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate()});
            }
            
        }
        else if(props.modalActive === 3) {
            props.setDataInputed({...props.dataInputed, year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate()});     
            setStartDate(new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate()));
            setIsDatePicked(true);
            
        }
        else if( props.modalActive === false) {
            props.setDataInputed({id: '', title: '', description:'', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: '', users: [], category: 'work', color: 'red'});
            setUsers({value: '', label: ''});
            setStartSelectedUsers([{value: '', label: ''}]);
            setIsDatePicked(false);
            setStartDate(new Date());
        }
    }, [props.modalActive]);
    
    useEffect(()=>{
        if(props.modalActive){
            fetchGetSubscribedUser();
        }
    }, [props.modalActive]);

    useEffect(()=>{
        if(props.dataInputed.type !== 'arrangement'){
            props.setDataInputed({...props.dataInputed, users: []});
        }
    }, [props.dataInputed.type]);
    useEffect(()=>{
        if(props.dataInputed.id && props.modalActive){
            fetchGetSubscribedUserToEvent();
        }
    }, [props.dataInputed.id, props.modalActive]);
    const someFoo = (e) =>{
        
        e.preventDefault();
        if(props.dataInputed.title.length < 6 || props.dataInputed.title.length >= 20){
            setError('The name must contain more than 6 characters and less than 20 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.dataInputed.description.length < 8){
            setError('The description must contain more than 8 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(!props.dataInputed.hours || !props.dataInputed.minutes){
            setError('Fill in the time field');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.modalActive == 2 && (!props.dataInputed.year || !props.dataInputed.month || !props.dataInputed.day)){
            setError('Choose a date');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if((new Date(props.dataInputed.year, props.dataInputed.month, props.dataInputed.day , props.dataInputed.hours, props.dataInputed.minutes).getTime() < new Date().getTime())){
            setError('You cannot plan an event for the past');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.dataInputed.type === 'arrangement'){
            
            if(props.dataInputed.duration.indexOf('.', props.dataInputed.duration.indexOf('.') + 1) !== -1){
                setError('Enter the correct duration of this meeting');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);
                return;
            }
            else if(+props.dataInputed.duration < 0.1){
                
                setError('Enter the duration of this meeting, longer than 0.1 hour');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);
                return;
            }
            else {
                if(props.modalActive === 3) {
                    props.fetchChangeEvent();
                    setIsDatePicked(false);
                    setStartDate(new Date());
                }
                else{
                    props.fetchCreateEvent();
                }
                if(props.modalActive == 2){
                    setIsDatePicked(false);
                    setStartDate(new Date());
                }
                props.setModalActive(false);
            }
        }
        else{

            if(props.modalActive === 3) {
                props.fetchChangeEvent();
            }
            else{
                props.fetchCreateEvent();
            }
            if(props.modalActive == 2){
                setIsDatePicked(false);
                setStartDate(new Date());
            }
            props.setModalActive(false);
        }
    }

    useEffect(()=>{
        if(getSubscribeUserError || getSubscribeUserToEventError){
            router('/error');
            
        }
    },[getSubscribeUserError, getSubscribeUserToEventError])
    console.log(props.dataInputed);
    return(
        <Modal modalActive={props.modalActive} setModalActive={props.setModalActive}>
            {isGetUserSubscribe
                ?
                <div className="create-event">
                    <div className="loading">
                        <div className="modal-up-title-container">
                            <p className="modal-title">Event</p>
                        </div>
                        <div className="modal-content-container">
                            <div>
                                <MyLoader />
                            </div>
                            <p>Loading...</p>
                        </div>
                    </div>  
                </div>  
                :
                <>
                    {isGetUserSubscribeToEventLoading
                        ?
                        <div className="create-event">
                            <div className="loading">
                                <div className="modal-up-title-container">
                                    <p className="modal-title">Event</p>
                                </div>
                                <div className="modal-content-container">
                                    <div>
                                        <MyLoader />
                                    </div>
                                    <p>Loading...</p>
                                </div>
                            </div>  
                        </div>  
                        :
                        <div className="modal-window-with-date">
                            {props.modalActive == 1
                                &&
                                <div className="date-title">
                                    {activeDate &&
                                        <p>{getNameMonth(activeDate.getMonth(), 0) + ' ' + activeDate.getDate() +  ", " + activeDate.getFullYear() }</p>
                                    }  
                                </div>
                            }
                            {props.modalActive == 3
                                &&
                                <div>
                                <div className="input-container">
                                    <DatePicker 
                                        locale="uk"
                                        className="input-file" 
                                        id='input-file'
                                        selected={startDate} 
                                        onChange={(date) => {
                                                setStartDate(date);
                                                props.setDataInputed({...props.dataInputed, year: date.getFullYear(), month: date.getMonth(), day: date.getDate()});
                                                setIsDatePicked(true);
                                            }
                                        } 
                                        minDate={new Date(2022, 10, 13)}
                                    />
                                    <label htmlFor="input-file" className="input-file-desc">
                                        <span className="input-file-icon">
                                            <i className="fa fa-calendar" aria-hidden="true"></i>
                                        </span>
                                        {isDatePicked 
                                            ? 
                                            <span className="input-file-text">{getNameMonth(startDate.getMonth(), 0) + ' ' + startDate.getDate() + ", " + startDate.getFullYear()}</span>
                                            :
                                            <span className="input-file-text">Select a date</span>
                                        }
                                    </label>
                                </div>                        
                            </div>
                            }
                            {props.modalActive == 2 &&
                                <div>
                                    <div className="input-container">
                                        <DatePicker 
                                            locale="uk"
                                            className="input-file" 
                                            id='input-file'
                                            selected={startDate} 
                                            onChange={(date) => {
                                                    setStartDate(date);
                                                    props.setDataInputed({...props.dataInputed, year: date.getFullYear(), month: date.getMonth(), day: date.getDate()});
                                                    setIsDatePicked(true);
                                                }
                                            } 
                                            minDate={new Date(2022, 10, 13)}
                                        />
                                        <label htmlFor="input-file" className="input-file-desc">
                                            <span className="input-file-icon">
                                                <i className="fa fa-calendar" aria-hidden="true"></i>
                                            </span>
                                            {isDatePicked 
                                                ? 
                                                <span className="input-file-text">{getNameMonth(startDate.getMonth(), 0) + ' ' + startDate.getDate() + ", " + startDate.getFullYear()}</span>
                                                :
                                                <span className="input-file-text">Select a date</span>
                                            }
                                            
                                        </label>
                                    </div>                        
                                </div>
                            }
                            
                            <form onSubmit={someFoo}>
                                <p>Title</p>
                                <MyInput 
                                    type="text" 
                                    placeholder="title" 
                                    value={props.dataInputed.title} 
                                    onChange={e => {
                                        if(e.target.value.length - props.dataInputed.title.length < 0){
                                            props.setDataInputed({...props.dataInputed, title: e.target.value});
                                        }
                                        else if(e.target.value.length > 20){
                                            clearTimeout(curTimeoutID);
                                            e.target.style.outline = '2px red solid';
                                            setError("The maximum length of your name is 20 characters");
                                            const id = setTimeout(()=>{setError('')}, 2000);
                                            setCurTimeoutID(id);
                                            setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                        }
                                        else {
                                            props.setDataInputed({...props.dataInputed, title: e.target.value});
                                        }
                                    }}
                                />
                                <p className="title-desc">Description</p>
                                <textarea placeholder="Enter a description of the calendar..." value={props.dataInputed.description} onChange={e => {props.setDataInputed({...props.dataInputed, description: e.target.value});}}/>
                                <div className="category-container">
                                    <p>Category</p>    
                                    <Select 
                                        className='select-create' 
                                        value={{value: props.dataInputed.category, label: props.dataInputed.category[0].toUpperCase() + props.dataInputed.category.slice(1)}} 
                                        options={[{value: 'work', label: 'Work'}, {value: 'home', label: 'Home'}, {value: 'sport', label: 'Sport'}]} 
                                        name="colors" 
                                        isClearable={false}
                                        isSearchable={false}
                                        placeholder='Select category'
                                        onChange={(e) =>{                                    
                                            props.setDataInputed({...props.dataInputed, category: e.value});
                                        }} 
                                        theme={theme => ({
                                            ...theme,
                                            colors: {
                                                primary: 'green',
                                                primary25: 'rgba(0, 0, 0, 0.2)',
                                                neutral0: '#FFFFFF',
                                                neutral10: 'rgba(0, 0, 0, 0.2)',
                                                neutral20: 'rgba(0, 0, 0, 0.5)',
                                                neutral30: 'rgba(0, 0, 0, 0.3)',
                                                neutral40: 'rgb(0, 125, 0)',
                                                neutral50: 'rgba(0, 0, 0, 0.7)',
                                                neutral80: 'green',
                                                danger: 'red',
                                                dangerLight: 'rgba(255, 0, 0, 0.2)',
                                            }
                                            
                                        })}
                                    />
                                </div>
                                <div className="color-container">
                                    <p className="color-title">Select color</p>
                                    <div className="color-content">
                                        <div className={props.dataInputed.color === 'red' ? "red active": 'red'} onClick={() => {props.dataInputed.color !=='red' ? props.setDataInputed({...props.dataInputed, color: 'red'}):''}}>0</div>
                                        <div className={props.dataInputed.color === 'orange' ? "orange active": 'orange'} onClick={() => {props.dataInputed.color !=='orange' ? props.setDataInputed({...props.dataInputed, color: 'orange'}):''}}>0</div>
                                        <div className={props.dataInputed.color === 'green' ? "green active": 'green'} onClick={() => {props.dataInputed.color !=='green' ? props.setDataInputed({...props.dataInputed, color: 'green'}):''}}>0</div>
                                        <div className={props.dataInputed.color === 'blue' ? "blue active": 'blue'} onClick={() => {props.dataInputed.color !=='blue' ? props.setDataInputed({...props.dataInputed, color: 'blue'}):''}}>0</div>
                                        <div className={props.dataInputed.color === 'darkblue' ? "darkblue active": 'darkblue'} onClick={() => {props.dataInputed.color !=='darkblue' ? props.setDataInputed({...props.dataInputed, color: 'darkblue'}):''}}>0</div>
                                        <div className={props.dataInputed.color === 'purple' ? "purple active": 'purple'} onClick={() => {props.dataInputed.color !=='purple' ? props.setDataInputed({...props.dataInputed, color: 'purple'}):''}}>0</div>
                                    </div>
                                </div>
                                {props.dataInputed.type === 'arrangement' &&
                                    <div className="invited-container">
                                        <p>Invited</p>    
                                        <Select 
                                            className='select-create' 
                                            isMulti 
                                            defaultValue={props.dataInputed.users.length === 0 ? null : startSelectedUsers}
                                            options={users} 
                                            name="colors" 
                                            placeholder='Invite users...'
                                            onChange={(e) =>{
                                                let tempArr = [];
                                                for(let i = 0; i < e.length; i++){
                                                    tempArr.push(e[i].value)
                                                    
                                                }
                                                props.setDataInputed({...props.dataInputed, users: tempArr});
                                            }} 
                                            theme={theme => ({
                                                ...theme,
                                                colors: {
                                                    primary: 'green',
                                                    primary25: 'rgba(0, 0, 0, 0.2)',
                                                    neutral0: '#FFFFFF',
                                                    neutral10: 'rgba(0, 0, 0, 0.2)',
                                                    neutral20: 'rgba(0, 0, 0, 0.5)',
                                                    neutral30: 'rgba(0, 0, 0, 0.3)',
                                                    neutral40: 'rgb(0, 125, 0)',
                                                    neutral50: 'rgba(0, 0, 0, 0.7)',
                                                    neutral80: 'green',
                                                    danger: 'red',
                                                    dangerLight: 'rgba(255, 0, 0, 0.2)',
                                                }
                                                
                                            })}
                                        />
                                    </div>
                                }
                                <p className="title-time">Time</p>
                                <div className="time-container">
                                    <MyInput 
                                        type="text" 
                                        value={props.dataInputed.hours} 
                                        onChange={e => {
                                            if(e.target.value.length - props.dataInputed.hours.length < 0){
                                                props.setDataInputed({...props.dataInputed, hours: e.target.value});
                                            }
                                            else if(!e.target.value || (e.target.value.match(/^\d*$/) !== null)) {
                                                if(+e.target.value >= 24){
                                                    props.setDataInputed({...props.dataInputed, hours: '23'});
                                                    
                                                } 
                                                else{
                                                    props.setDataInputed({...props.dataInputed, hours: e.target.value});
                                                }
                                                if(e.target.value.length >= 2){
                                                    e.target.blur();
                                                    e.target.nextElementSibling.nextElementSibling.focus();
                                                }  
                                                
                                            }
                                            else{
                                                clearTimeout(curTimeoutID);
                                                e.target.style.outline = '1px red solid';
                                                setError("You can only enter numbers");
                                                const id = setTimeout(()=>{setError('')}, 2000);
                                                setCurTimeoutID(id);
                                                setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                            }
                                        }}
                                    />
                                    <p>:</p>
                                    <MyInput 
                                        type="text" 
                                        value={props.dataInputed.minutes} 
                                        onChange={e => {
                                            if(e.target.value.length - props.dataInputed.minutes.length < 0){
                                                props.setDataInputed({...props.dataInputed, minutes: e.target.value});
                                            }
                                            else if(!e.target.value || (e.target.value.match(/^\d*$/) !== null)) {
                                                if(+e.target.value >= 59){
                                                    props.setDataInputed({...props.dataInputed, minutes: '59'});
                                                    
                                                } 
                                                else{
                                                    props.setDataInputed({...props.dataInputed, minutes: e.target.value});
                                                }
                                                if(e.target.value.length >= 2){
                                                    e.target.blur();
                                                }  
                                                
                                            }
                                            else{
                                                clearTimeout(curTimeoutID);
                                                e.target.style.outline = '1px red solid';
                                                setError("You can only enter numbers");
                                                const id = setTimeout(()=>{setError('')}, 2000);
                                                setCurTimeoutID(id);
                                                setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                            }
                                        }}
                                    />
                                </div>
                                <p className="title-select">Type</p>
                                <Select 
                                    className='select-create' 
                                    name="roles" 
                                    value={{value: props.dataInputed.type, label: getNameEvent(props.dataInputed.type)}}
                                    defaultValue={{value: props.dataInputed.type, label: props.dataInputed.type}}
                                    isClearable={false}
                                    isSearchable={false}
                                    options={[{value: 'reminder', label: 'Reminder'}, {value: 'task', label: 'Task'}, {value: 'arrangement', label: 'Arrangement'}]}
                                    onChange={(e)=>{props.setDataInputed({...props.dataInputed, type: e.value})}} 
                                    theme={theme => ({
                                        ...theme,
                                        colors: {
                                            primary: 'green',
                                            primary25: 'rgba(0, 0, 0, 0.2)',
                                            neutral0: '#FFFFFF',
                                            neutral10: 'rgba(0, 0, 0, 0.2)',
                                            neutral20: 'rgba(0, 0, 0, 0.5)',
                                            neutral30: 'rgba(0, 0, 0, 0.3)',
                                            neutral40: 'rgb(0, 125, 0)',
                                            neutral50: 'rgba(0, 0, 0, 0.7)',
                                            neutral80: 'green',
                                            danger: 'red',
                                            dangerLight: 'rgba(255, 0, 0, 0.2)',
                                        }
                                        
                                    })}
                                />
                                {props.dataInputed.type === 'arrangement' &&
                                    <div className="duration-container">
                                        <p>Duration (hours)</p>    
                                        <MyInput 
                                            type="text"
                                            placeholder="duration" 
                                            value={props.dataInputed.duration} 
                                            onChange={e => {
                                                if(e.target.value.length - props.dataInputed.duration.length < 0){
                                                    props.setDataInputed({...props.dataInputed, duration: e.target.value});
                                                }
                                                else if(!e.target.value || e.target.value.match(/^\d*\.?\d*$/)) {
                                                    if(+e.target.value >= 12){
                                                        props.setDataInputed({...props.dataInputed, duration: '12'});
                                                        e.target.blur();
                                                        
                                                    } 
                                                    else{
                                                        props.setDataInputed({...props.dataInputed,duration: e.target.value});
                                                    }
                                                }
                                                else{
                                                    clearTimeout(curTimeoutID);
                                                    e.target.style.outline = '1px red solid';
                                                    setError("You can only enter numbers or a point");
                                                    const id = setTimeout(()=>{setError('')}, 2000);
                                                    setCurTimeoutID(id);
                                                    setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                                }
                                            }}
                                        />
                                    </div>
                                }
                                {error && <p className="error">{error}</p>}
                                {props.modalActive == 3 
                                    ?
                                    <MyButton type='submit'>Change</MyButton>
                                    :
                                    <MyButton type='submit'>Create</MyButton>
                                }
                                
                            </form>
                        </div>
                    }
                </>
            }
        </Modal>
    );
    
}

export default CreateEvent;

//activeDATE НЕПАРНА ГОДИНА! 2)КОЛИ ВИДАЛЯЄЩ _ ЛОАДЕР МАЄ БУТИ!