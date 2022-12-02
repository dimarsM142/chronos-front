import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDateAction, addActiveAction} from "../../store/dateReducer";
import PostService from "../../API/PostService";
import { useFetching } from "../../hooks/useFetching";
import OneEvent from "../OneEvent";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import MyButton from "../UI/MyButton";
import getNameMonth from "../getNameMonth";
import CreateEvent from "../Create-event.js";
import Select from 'react-select';
import MyLoader from "../UI/MyLoader2";
import './Month.css';

const arrOfMonth = [{value: 'January', label: 'January'}, 
                    {value: 'February', label: 'February'}, 
                    {value: 'March', label: 'March'}, 
                    {value: 'April', label: 'April'}, 
                    {value: 'May', label: 'May'}, 
                    {value: 'June', label: 'June'},
                    {value: 'July', label: 'July'}, 
                    {value: 'August', label: 'August'}, 
                    {value: 'September', label: 'September'}, 
                    {value: 'October', label: 'October'}, 
                    {value: 'November', label: 'November'}, 
                    {value: 'December', label: 'December'}];
const arrOfYear =  [];
function monthFormated(date){
    let resArr = [undefined, undefined, undefined, undefined, undefined, undefined];
    const startDay = moment(date).startOf('month')._d.getDay() === 0 ? 7 : moment(date).startOf('month')._d.getDay(); 
    let finishDay = moment(date).endOf('month')._d.getDate()
    let totalCount = 1;
    let isStart = false;
    for(let i = 1; i < 7; i++){
        if(i !== 1 && !isStart){
            break;
        }
        resArr[i] = [];
        for(let j = 1; j < 8; j++){
            if(i === 1 && startDay === j){
                isStart = true;
            }
            
            if(isStart){
                resArr[i][j] = totalCount;
                totalCount++;
            }
            else{
                resArr[i][j] = '';
            }
            if(totalCount > finishDay){
                isStart = false;
            }
            

        }
    }
    return(resArr);
}
const Month = (props) => {
    const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const router = useNavigate();
    const dispatch = useDispatch();
    const selectedDate = new Date(useSelector( (state) => state.cash.curDate));
    const activeDate = useSelector( (state) => state.cash.activeDate);
    const [dataInputed, setDataInputed] = useState({id: '', title: '', description: '', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: '', users: [], category: 'work', color: 'red'});
    const [category, setCategory] = useState('all');
    const [month, SetMonth] = useState([undefined, undefined, undefined, undefined, undefined, undefined]);
    const [events, setEvents] = useState([]); 
    const [dateEvents, setDateEvents] = useState([]);
    
    const [fetchEvents, isEventsLoading, eventsError] = useFetching(async () => {
        if(props.typeCalendar === 'ordinary') {

            const response = await PostService.getEventsByMonth(
                localStorage.getItem('access'), 
                +window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10), 
                selectedDate.getFullYear(), 
                (selectedDate.getMonth() + 1).toString().length === 1 ? '0' + (selectedDate.getMonth() + 1): selectedDate.getMonth() + 1,
                category
            );
            let arr = [];
            let arrOfDates = [];
            for(let i = 0; i < response.data.length; i++){
                arr[i] = {id: response.data[i].id, title: response.data[i].title, description: response.data[i].description, date: new Date(response.data[i].execution_date),  type: response.data[i].type,  duration:  Math.ceil((response.data[i].duration / 3600) * 100) / 100, category: response.data[i].category, login: response.data[i].login, color: response.data[i].color};
                arrOfDates[i] = arr[i].date.getDate();
            }
            setDateEvents(arrOfDates);
            setEvents(arr);

        }
        else {
            const response = await PostService.getEventsHolidaysCalendarByMonthFromGoogleAPI(
                new Date().getFullYear(), 
                (selectedDate.getMonth() + 1).toString().length === 1 ? '0' + (selectedDate.getMonth() + 1): selectedDate.getMonth() + 1
            );
            let arr = [];
            let arrOfDates = [];
            for(let i = 0; i < response.length; i++){
                arr[i] = {id: response[i].id, title: response[i].title, description: response[i].description, date: new Date(response[i].execution_date),  type: response[i].type,  duration:  Math.ceil((response[i].duration / 3600) * 100) / 100};
                arrOfDates[i] = arr[i].date.getDate();
            }
            setDateEvents(arrOfDates);
            setEvents(arr);
        }
    })

    const [fetchCreateEvent, isCreateEventLoading, createEventError] = useFetching(async () => {
        await PostService.createEvent(
            localStorage.getItem('access'), 
            window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10),
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
        setDataInputed({id: '', title: '', description:'', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: '', users: [], category: 'work', color: 'red'});
        fetchEvents();
    })
    
    const [fetchChangeEvent, isChangeEventLoading, changeEventError] = useFetching(async () => {
        await PostService.changeEvent(
            localStorage.getItem('access'), 
            window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10),
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
        setDataInputed({id: '', title: '', description:'', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: '', users: [], category: 'work', color: 'red'});
        fetchEvents();
    })
    useEffect(()=>{

        for(let i = 0; i < 20; i++){
            arrOfYear[i] = { value: selectedDate.getFullYear() - 10 + i, label: selectedDate.getFullYear() - 10 + i};
        }
        SetMonth(monthFormated(selectedDate));
        fetchEvents();

    }, []);
    useEffect(()=>{
        if(eventsError || createEventError || changeEventError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[eventsError, createEventError, changeEventError]);
    useEffect(()=>{
        fetchEvents();
    }, [selectedDate.getMonth(), selectedDate.getFullYear()])
    useEffect(()=>{
        if(category){
            fetchEvents();
        }
    }, [category]);
    const monthLess = () =>{   
        let maxDate = (moment(`${selectedDate.getFullYear()}-${selectedDate.getMonth() === 0 ? 12 : selectedDate.getMonth()}-10`).endOf('month')._d.getDate());
        let updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
        SetMonth(monthFormated(updatedDate));
        dispatch(addDateAction(updatedDate.getTime()));
        if(activeDate) {
            dispatch(addActiveAction(updatedDate));
        }
    }   
    const monthMore = () =>{
        let maxDate = (moment(`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 2 === 13 ? 1 : selectedDate.getMonth() + 2}-10`).endOf('month')._d.getDate());
        let updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
        SetMonth(monthFormated(updatedDate));
        dispatch(addDateAction(updatedDate.getTime()));
        if(activeDate) {
            dispatch(addActiveAction(updatedDate));
        }
    }   
    const activeDay = (e) =>{   
        let updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), e.currentTarget.firstElementChild.textContent, +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());       
        if(e.currentTarget.className.includes('active')){
            dispatch(addActiveAction(null));
        }
        else{
            dispatch(addActiveAction(updatedDate));
        }
        dispatch(addDateAction(updatedDate.getTime()));
    }
    const changeCategory = (e) =>{
        if(category !== e.target.textContent){
            setCategory(e.target.textContent);           
        }
    }

   
    if(props.typeCalendar === 'ordinary') {
        if(isEventsLoading || isChangeEventLoading || isCreateEventLoading){
        
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
        else{
            return (
                <div className="month-container">
                    <p className="up-part-title">Select a date</p>
                    <div className="up-part">
                        <div onClick={monthLess}><i className="fa fa-caret-square-o-left" aria-hidden="true"></i></div>
                        <p className="current-date">{getNameMonth(selectedDate.getMonth(), 1) +  " " + selectedDate.getFullYear()} </p>
                        <div onClick={monthMore}><i className="fa fa-caret-square-o-right" aria-hidden="true"></i></div>
                    </div>
                    <div className="select-container">
                        <Select 
                            className='select-create' 
                            name="roles" 
                            value={{value: getNameMonth(selectedDate.getMonth(), 1), label: getNameMonth(selectedDate.getMonth(), 1)}}
                            isClearable={false}
                            options={arrOfMonth}
                            onChange={(e)=>{
        
                                for(let i = 0; i < arrOfMonth.length; i++){
                                    if(arrOfMonth[i].value === e.value){
                                        let maxDate = (moment(`${selectedDate.getFullYear()}-${i + 1}-10`).endOf('month')._d.getDate());
                                        let updatedDate = new Date(selectedDate.getFullYear(), i, +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                        SetMonth(monthFormated(updatedDate));
                                        dispatch(addDateAction(updatedDate.getTime()));
                                        if(activeDate) {
                                            dispatch(addActiveAction(updatedDate));
                                        }
                                        break;
                                    }
                                }
                            }} 
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    primary: 'green',
                                    primary25: 'rgba(0,0,0,0.2)',
                                    neutral0: '#FFFFFF',
                                    neutral10: 'rgba(0, 0, 0, 0.2)',
                                    neutral20: 'rgba(0, 0, 0, 0.5)',
                                    neutral30: 'rgba(0, 0, 0, 0.3)',
                                    neutral40: 'rgb(0, 125, 0)',
                                    neutral50: 'rgba(0, 0, 0, 0.7)',
                                    neutral80: 'rgba(0, 0, 0, 0.7)',
                                    danger: 'red',
                                    dangerLight: 'rgba(255, 0, 0, 0.2)',
                                }
                                
                            })}
                        />
                        <Select 
                            className='select-create' 
                            name="roles" 
                            value={{value: selectedDate.getFullYear(), label: selectedDate.getFullYear()}}
                            isClearable={false}
                            options={arrOfYear}
                            onChange={(e)=>{
                                let maxDate = (moment(`${e.value}-${selectedDate.getMonth() + 1}-10`).endOf('month')._d.getDate());
                                let updatedDate = new Date(e.value, selectedDate.getMonth(), +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                SetMonth(monthFormated(updatedDate));
                                dispatch(addDateAction(updatedDate.getTime()));
                                if(activeDate){
                                    dispatch(addActiveAction(updatedDate));
                                }
                                for(let i = 0; i < 20; i++){
                                    if(e.value - 10 >= 1970){
                                        arrOfYear[i] = { value: e.value - 10 + i, label: e.value - 10 + i};
                                    }
                                    else{
                                        arrOfYear[i] = { value: 1970 + i, label: 1970 + i};
                                    }
                                }
                                
                            }} 
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    primary: 'green',
                                    primary25: 'rgba(0,0,0,0.2)',
                                    neutral0: '#FFFFFF',
                                    neutral10: 'rgba(0, 0, 0, 0.2)',
                                    neutral20: 'rgba(0, 0, 0, 0.5)',
                                    neutral30: 'rgba(0, 0, 0, 0.3)',
                                    neutral40: 'rgb(0, 125, 0)',
                                    neutral50: 'rgba(0, 0, 0, 0.7)',
                                    neutral80: 'rgba(0, 0, 0, 0.7)',
                                    danger: 'red',
                                    dangerLight: 'rgba(255, 0, 0, 0.2)',
                                }
                                
                            })}
                        />
                    </div>
        
                    <p className="up-part-categories">Select categories</p>
                    <div className="categories">
                        <p onClick={changeCategory} className={category === 'work' ? 'active' : ''}>work</p>
                        <p onClick={changeCategory} className={category === 'home' ? 'active' : ''}>home</p>
                        <p onClick={changeCategory} className={category === 'sport' ? 'active' : ''}>sport</p>
                        <p onClick={changeCategory} className={category === 'all' ? 'active' : ''}>all</p>
                    </div>
                    <p className="center-container-title">Calendar</p>
                    <div className="center-container">
                        <div className="one-calendar">
                            <table>
                                <thead>
                                    <tr>
                                        {weeks.map(week => <th key={week}>{week}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {month.map((week, index) =>
                                        week !== undefined && 
                                            <tr className="row-calendar" key={index}>
                                                {week.map((day, index) =>
                                                    day.toString().length <= 0
                                                        ?
                                                        <td key={index} >
                                                            <p>{day}</p>
                                                        </td>   
                                                        :
                                                        (selectedDate.getFullYear().toString() + selectedDate.getMonth() + day) === (new Date().getFullYear().toString() + new Date().getMonth() + new Date().getDate()) 
                                                            ? 
                                                            activeDate && day === activeDate.getDate() 
                                                                ?
                                                                <td key={index} className={dateEvents.includes(day) ? 'fill-cell active today event' : 'fill-cell active today' } onClick={activeDay}>
                                                                        <p>{day}</p>
                                                                        <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                                :
                                                                <td key={index} className={dateEvents.includes(day)  ? 'fill-cell today event' : 'fill-cell today'} onClick={activeDay}>
                                                                    <p>{day}</p>
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                            :
                                                            activeDate && day === activeDate.getDate() 
                                                            ?
                                                                <td key={index} className={dateEvents.includes(day)  ? 'fill-cell active event':  'fill-cell active'} onClick={activeDay}>
                                                                    
                                                                    <p>{day}</p>
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                                :
                                                                <td key={index} className={dateEvents.includes(day)  ? 'fill-cell event' : 'fill-cell'} onClick={activeDay}>
                                                                    <p>{day}</p>
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                )}
                                            </tr>
                                    )}
                                </tbody>
        
                            </table>
                        </div>
                        {activeDate !== null &&
                            <div className="event-container">
                                {activeDate.getTime() >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0).getTime() && 
                                    <div>
                                        {props.role === 'admin' &&
                                            <MyButton onClick={()=>{props.setModalActive(1)}}>Create a new event</MyButton>
                                        }
                                    </div>
                                }
                               
                                {dateEvents.includes(activeDate.getDate())
                                ?   
                                <div className="all-events-on-day">
                                    {events.filter(event => event.date.getDate() === activeDate.getDate())
                                        .map(curEvent => 
                                            <OneEvent event={curEvent} key={curEvent.id} setModalActive={props.setModalActive} dataInputed={dataInputed} setDataInputed={setDataInputed} fetchEvents={fetchEvents} role={props.role} isOwner={props.isOwner} typeCalendar={'ordinary'}/>
                                        )
                                    }
                                </div>
                                :
                                    <p className="no-events">There are no events for this day</p>
                                }
                            </div>
                        }                
                    </div>
                    <CreateEvent 
                        modalActive={props.modalActive} 
                        setModalActive={props.setModalActive} 
                        fetchCreateEvent={fetchCreateEvent} 
                        fetchChangeEvent={fetchChangeEvent}
                        dataInputed={dataInputed}
                        setDataInputed={setDataInputed}
                        typeOfDuration={props.typeOfDuration}
                    />
                </div>
            );
        }
    }
    else {
        if(isEventsLoading){
        
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
        else {
            return(
                <div className="month-container">
                    <p className="up-part-title">Select a date</p>
                    <div className="up-part">
                        <div onClick={monthLess}><i className="fa fa-caret-square-o-left" aria-hidden="true"></i></div>
                        <p className="current-date">{getNameMonth(selectedDate.getMonth(), 1) +  " " + selectedDate.getFullYear()} </p>
                        <div onClick={monthMore}><i className="fa fa-caret-square-o-right" aria-hidden="true"></i></div>
                    </div>
                    <div className="select-container">
                        <Select 
                            className='select-create' 
                            name="roles" 
                            value={{value: getNameMonth(selectedDate.getMonth(), 1), label: getNameMonth(selectedDate.getMonth(), 1)}}
                            isClearable={false}

                            options={arrOfMonth}
                            onChange={(e)=>{
        
                                for(let i = 0; i < arrOfMonth.length; i++){
                                    if(arrOfMonth[i].value === e.value){
                                        let maxDate = (moment(`${selectedDate.getFullYear()}-${i + 1}-10`).endOf('month')._d.getDate());
                                        let updatedDate = new Date(selectedDate.getFullYear(), i, +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                        SetMonth(monthFormated(updatedDate));
                                        dispatch(addDateAction(updatedDate.getTime()));
                                        if(activeDate) {
                                            dispatch(addActiveAction(updatedDate));
                                        }
                                        break;
                                    }
                                }
                            }} 
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    primary: 'green',
                                    primary25: 'rgba(0,0,0,0.2)',
                                    neutral0: '#FFFFFF',
                                    neutral10: 'rgba(0, 0, 0, 0.2)',
                                    neutral20: 'rgba(0, 0, 0, 0.5)',
                                    neutral30: 'rgba(0, 0, 0, 0.3)',
                                    neutral40: 'rgb(0, 125, 0)',
                                    neutral50: 'rgba(0, 0, 0, 0.7)',
                                    neutral80: 'rgba(0, 0, 0, 0.7)',
                                    danger: 'red',
                                    dangerLight: 'rgba(255, 0, 0, 0.2)',
                                }
                                
                            })}
                        />
                        <Select 
                            className='select-create' 
                            name="roles" 
                            value={{value: selectedDate.getFullYear(), label: selectedDate.getFullYear()}}
                            isClearable={false}

                            options={arrOfYear}
                            onChange={(e)=>{
                                let maxDate = (moment(`${e.value}-${selectedDate.getMonth() + 1}-10`).endOf('month')._d.getDate());
                                let updatedDate = new Date(e.value, selectedDate.getMonth(), +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                SetMonth(monthFormated(updatedDate));
                                dispatch(addDateAction(updatedDate.getTime()));
                                if(activeDate){
                                    dispatch(addActiveAction(updatedDate));
                                }
                                for(let i = 0; i < 20; i++){
                                    if(e.value - 10 >= 1970){
                                        arrOfYear[i] = { value: e.value - 10 + i, label: e.value - 10 + i};
                                    }
                                    else{
                                        arrOfYear[i] = { value: 1970 + i, label: 1970 + i};
                                    }
                                }
                                
                            }} 
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    primary: 'green',
                                    primary25: 'rgba(0,0,0,0.2)',
                                    neutral0: '#FFFFFF',
                                    neutral10: 'rgba(0, 0, 0, 0.2)',
                                    neutral20: 'rgba(0, 0, 0, 0.5)',
                                    neutral30: 'rgba(0, 0, 0, 0.3)',
                                    neutral40: 'rgb(0, 125, 0)',
                                    neutral50: 'rgba(0, 0, 0, 0.7)',
                                    neutral80: 'rgba(0, 0, 0, 0.7)',
                                    danger: 'red',
                                    dangerLight: 'rgba(255, 0, 0, 0.2)',
                                }
                                
                            })}
                        />
                    </div>
        
        
                    <p className="center-container-title">Calendar</p>
                    <div className="center-container">
                        <div className="one-calendar">
                            <table>
                                <thead>
                                    <tr>
                                        {weeks.map(week => <th key={week}>{week}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {month.map((week, index) =>
                                        week !== undefined && 
                                            <tr className="row-calendar" key={index}>
                                                {week.map((day, index) =>
                                                    day.toString().length <= 0
                                                        ?
                                                        <td key={index} >
                                                            <p>{day}</p>
                                                        </td>   
                                                        :
                                                        (selectedDate.getFullYear().toString() + selectedDate.getMonth() + day) === (new Date().getFullYear().toString() + new Date().getMonth() + new Date().getDate()) 
                                                            ? 
                                                            activeDate && day === activeDate.getDate() 
                                                                ?
                                                                <td key={index} className={dateEvents.includes(day) ? 'fill-cell active today event' : 'fill-cell active today' } onClick={activeDay}>
                                                                        <p>{day}</p>
                                                                        <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                                :
                                                                <td key={index} className={dateEvents.includes(day)  ? 'fill-cell today event' : 'fill-cell today'} onClick={activeDay}>
                                                                    <p>{day}</p>
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                            :
                                                            activeDate && day === activeDate.getDate() 
                                                            ?
                                                                <td key={index} className={dateEvents.includes(day)  ? 'fill-cell active event':  'fill-cell active'} onClick={activeDay}>
                                                                    
                                                                    <p>{day}</p>
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                                :
                                                                <td key={index} className={dateEvents.includes(day)  ? 'fill-cell event' : 'fill-cell'} onClick={activeDay}>
                                                                    <p>{day}</p>
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                                </td>
                                                )}
                                            </tr>
                                    )}
                                </tbody>
        
                            </table>
                        </div>
                        {activeDate !== null &&
                            <div className="event-container">
                                {activeDate.getTime() >= new Date().getTime() &&  
                                    <div>
                                        {props.role === 'admin' &&
                                            <MyButton onClick={()=>{props.setModalActive(1)}}>Create a new event</MyButton>
                                        }
                                    </div>
                                }
                               
                                {dateEvents.includes(activeDate.getDate())
                                ?   
                                <div className="all-events-on-day">
                                    {events.filter(event => event.date.getDate() === activeDate.getDate())
                                        .map(curEvent => 
                                            <OneEvent event={curEvent} key={curEvent.id} setModalActive={props.setModalActive} dataInputed={dataInputed} setDataInputed={setDataInputed} fetchEvents={fetchEvents} role={props.role} isOwner={false} typeCalendar={'main'}/>
                                        )
                                    }
                                </div>
                                :
                                    <p className="no-events">There are no events for this day</p>
                                }
                            </div>
                        }                
                    </div>
                </div>
            );
        }
    }
    
}

export default Month;