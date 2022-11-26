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
import './Week.css';


function getTitleMonth(date, curWeek){

    
    if((curWeek[6] - curWeek[0]) > 0){
        return getNameMonth(date.getMonth(), 1) +  " " + date.getFullYear() + " року";
        
    }
    else if(date.getDate() - curWeek[0] >= 0){
        if(date.getMonth() === 11){
            return "Грудень " + date.getFullYear() + " року" + ' - ' + "Січень " + (date.getFullYear() + 1) + " року"
        }
        else{
            return getNameMonth(+date.getMonth(), 1) + ' - ' + getNameMonth(+date.getMonth() + 1, 1) + " " + date.getFullYear() + " року"
        }
        
    }
    else if(date.getDate() - curWeek[0] < 0){
        if(date.getMonth() === 0){
            return "Грудень " + (date.getFullYear() - 1) + " року" + ' - ' + "Січень " + date.getFullYear() + " року"
        }
        else{
            return getNameMonth(+date.getMonth() - 1, 1) + ' - ' +  getNameMonth(+date.getMonth(), 1) + " " + date.getFullYear() + " року"
        }
        
    }

    
}


const arrOfMonth = [{value: 'Січень', label: 'Січень'}, {value: 'Лютий', label: 'Лютий'}, {value: 'Березень', label: 'Березень'}, {value: 'Квітень', label: 'Квітень'}, {value: 'Травень', label: 'Травень'}, {value: 'Червень', label: 'Червень'}, {value: 'Липень', label: 'Липень'}, {value: 'Серпень', label: 'Серпень'}, {value: 'Вересень', label: 'Вересень'}, {value: 'Жовтень', label: 'Жовтень'}, {value: 'Листопад', label: 'Листопад'}, {value: 'Грудень', label: 'Грудень'}];
const arrOfYear =  [];
function monthFormated(date){
    let resArr = [];
    if(date.getDay() === 0){
        for(let j = 0; j < 7; j++){
            resArr[j] = new Date((moment(date).startOf('week')._d.getTime() + 1000 * 60 * 60 * 10) + ((j - 6) * (1000 * 60 * 60 * 24))).getDate() 
        }
        return(resArr);
    }
    else{
        for(let j = 0; j < 7; j++){
            resArr[j] = new Date((moment(date).startOf('week')._d.getTime() + 1000 * 60 * 60 * 10) + ((j + 1) * (1000 * 60 * 60 * 24))).getDate() 
        }
        return(resArr);
    }    
}
const Week = (props) => {
    const weeks = ["Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт", "Ндл"];
    const month = [
        ['00', '00', '00', '00', '00', '00', '00'], 
        ['02', '02', '02', '02', '02', '02', '02'], 
        ['04', '04', '04', '04', '04', '04', '04'], 
        ['06', '06', '06', '06', '06', '06', '06'], 
        ['08', '08', '08', '08', '08', '08', '08'],
        ['10', '10', '10', '10', '10', '10', '10'],
        ['12', '12', '12', '12', '12', '12', '12'], 
        ['14', '14', '14', '14', '14', '14', '14'],
        ['16', '16', '16', '16', '16', '16', '16'], 
        ['18', '18', '18', '18', '18', '18', '18'], 
        ['20', '20', '20', '20', '20', '20', '20'], 
        ['22', '22', '22', '22', '22', '22', '22']
    ];
    const [curWeek, setCurWeek] = useState([]);
    const router = useNavigate();
    const dispatch = useDispatch();
    const selectedDate = new Date(useSelector( (state) => state.cash.curDate));
    const activeDate = useSelector( (state) => state.cash.activeDate);
    const [dataInputed, setDataInputed] = useState({id: '', title: '', description: '', hours: props.typeOfDuration === 'Тиждень' ? selectedDate.getHours() : new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: ''});

    const [events, setEvents] = useState([]); 
    const [dateEvents, setDateEvents] = useState([]);


    const [fetchEvents, isEventsLoading, eventsError] = useFetching(async () => {
        let arr = [];
        let arrOfDates = [];
        let response;
        if(props.typeCalendar === 'ordinary') {
            response = await PostService.getEventsByWeek(
                localStorage.getItem('access'), 
                +window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10), 
                selectedDate.getFullYear(), 
                (selectedDate.getMonth() + 1).toString().length === 1 ? '0' + (selectedDate.getMonth() + 1): selectedDate.getMonth() + 1,
                curWeek[0]
            );
            for(let i = 0; i < response.data.length; i++){
                arr[i] = {id: response.data[i].id, title: response.data[i].title, description: response.data[i].description, date: new Date(response.data[i].execution_date),  type: response.data[i].type,  duration:  Math.ceil((response.data[i].duration / 3600) * 100) / 100};
                arrOfDates[i] = arr[i].date.getDate().toString() + (arr[i].date.getHours().toString().length === 1 ? '0' + arr[i].date.getHours(): arr[i].date.getHours());
            }
            
        }
        else {
            response = await PostService.getEventsHolidaysCalendarByMonthFromGoogleAPI(
                new Date().getFullYear(), 
                (selectedDate.getMonth() + 1).toString().length === 1 ? '0' + (selectedDate.getMonth() + 1): selectedDate.getMonth() + 1
            );
            for(let i = 0; i < response.length; i++){
                arr[i] = {id: response[i].id, title: response[i].title, description: response[i].description, date: new Date(new Date(response[i].execution_date).setMinutes(new Date(response[i].execution_date).getMinutes() + new Date().getTimezoneOffset())),  type: response[i].type,  duration:  Math.ceil((response[i].duration / 3600) * 100) / 100};
                arrOfDates[i] = arr[i].date.getDate().toString() + (arr[i].date.getHours().toString().length === 1 ? '0' + arr[i].date.getHours(): arr[i].date.getHours());
            }
        }
        setDateEvents(arrOfDates);
        setEvents(arr);
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
            dataInputed.duration
        );
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
            dataInputed.duration
        );
        fetchEvents();
    })
    useEffect(()=>{

        for(let i = 0; i < 20; i++){
            arrOfYear[i] = { value: selectedDate.getFullYear() - 10 + i, label: selectedDate.getFullYear() - 10 + i};
        }
        setCurWeek(monthFormated(selectedDate));
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
    }, [curWeek])
    const monthLess = () =>{   
        let updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), +selectedDate.getDate() - 7, activeDate ? activeDate.getHours() : +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
        setCurWeek(monthFormated(updatedDate));
        dispatch(addDateAction(updatedDate.getTime()));
        if(activeDate) {
            dispatch(addActiveAction(updatedDate));
        }
    }   
    const monthMore = () =>{
        let updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), +selectedDate.getDate() + 7, activeDate ? activeDate.getHours() : +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
        setCurWeek(monthFormated(updatedDate));
        dispatch(addDateAction(updatedDate.getTime()));
        if(activeDate) {
            dispatch(addActiveAction(updatedDate));
        }
    }   

    const activeDay = (e, hour, indexOfDay) =>{        
        let updatedDate;
        if(curWeek[indexOfDay] - selectedDate.getDate() > 7){
            updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, curWeek[indexOfDay], hour, +new Date().getMinutes(), +new Date().getSeconds());
        }
        else if(curWeek[indexOfDay] - selectedDate.getDate() < -7){
            updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, curWeek[indexOfDay], hour, +new Date().getMinutes(), +new Date().getSeconds());      
        }
        else{
            updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), curWeek[indexOfDay], hour, +new Date().getMinutes(), +new Date().getSeconds());
        }
         
        if(e.currentTarget.className.includes('active')){
            dispatch(addActiveAction(null));
        }
        else{

            dispatch(addActiveAction(updatedDate));
        }
        dispatch(addDateAction(updatedDate.getTime()));
    }
 

    if(props.typeCalendar === 'ordinary') {
        if(isEventsLoading || isChangeEventLoading || isCreateEventLoading){
        
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
        else{
    
            return (
                <div className="week-container">
                    <p className="up-part-title">Оберіть дату</p>
                    <div className="up-part">
                        <div onClick={monthLess}><i className="fa fa-caret-square-o-left" aria-hidden="true"></i></div>
                        <p className="current-date">{getTitleMonth(selectedDate, curWeek)} </p>
                        <div onClick={monthMore}><i className="fa fa-caret-square-o-right" aria-hidden="true"></i></div>
                    </div>
                    <div className="select-container">
                        <Select 
                            className='select-create' 
                            name="roles" 
                            value={{value: getNameMonth(selectedDate.getMonth(), 1), label: getNameMonth(selectedDate.getMonth(), 1)}}
                            isClearable={false}
                            placeholder='Категорії'
                            options={arrOfMonth}
                            onChange={(e)=>{
        
                                for(let i = 0; i < arrOfMonth.length; i++){
                                    if(arrOfMonth[i].value === e.value){
                                        let maxDate = (moment(`${selectedDate.getFullYear()}-${i + 1}-10`).endOf('month')._d.getDate());
                                        let date = activeDate ? +activeDate.getDate() : selectedDate.getDate();
                                        let updatedDate = new Date(selectedDate.getFullYear(), i, date > maxDate ? maxDate : date, activeDate ? activeDate.getHours() : +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                        setCurWeek(monthFormated(updatedDate));
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
                            placeholder='Категорії'
                            options={arrOfYear}
                            onChange={(e)=>{
                                let maxDate = (moment(`${e.value}-${selectedDate.getMonth() + 1}-10`).endOf('month')._d.getDate());
                                let updatedDate = new Date(e.value, selectedDate.getMonth(), +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                setCurWeek(monthFormated(updatedDate));
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
        
        
                    <p className="center-container-title">Календар</p>
                    <div className="center-container">
                        <div className="title-time">  
                            <p>00:00</p>
                            <p>02:00</p>
                            <p>04:00</p>
                            <p>06:00</p>
                            <p>08:00</p>
                            <p>10:00</p>
                            <p>12:00</p>
                            <p>14:00</p>
                            <p>16:00</p>
                            <p>18:00</p>
                            <p>20:00</p>
                            <p>22:00</p>
                            <p>24:00</p>
                            
                        </div>
                        <div className="one-calendar">
                            <table>
                                <thead>
                                    <tr>
                                        {weeks.map(week => <th key={week}>{week}</th>)}
                                    </tr>
                                    <tr>
                                        {curWeek.map((week, index) => <th key={index}>{week}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {month.map((week, indexOfArr) =>
                                        week !== undefined && 
                                            <tr className="row-calendar" key={indexOfArr}>
                                                {week.map((time, index) =>
                                                    
                                                    
                                                    (selectedDate.getFullYear().toString() + selectedDate.getMonth() + curWeek[index] + time) === 
                                                        (new Date().getFullYear().toString() + new Date().getMonth() + new Date().getDate() + (new Date().getHours().toString().length === 1 ? '0' + new Date().getHours():new Date().getHours())) ||  
                                                        (selectedDate.getFullYear().toString() + selectedDate.getMonth() + curWeek[index] + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1))) === 
                                                        (new Date().getFullYear().toString() + new Date().getMonth() + new Date().getDate() + (new Date().getHours().toString().length === 1 ? '0' + new Date().getHours():new Date().getHours())) 
                                                        ?
    
                                                       
                                                        activeDate !== null && curWeek[index] && (curWeek[index].toString() + time === activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours()))
                                                            ?
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1)))) ? 'fill-cell active today event' : 'fill-cell active today' } onClick={(e) => {activeDay(e ,week[0], index)}}> 
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                            :
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1))))  ? 'fill-cell today event' : 'fill-cell today'} onClick={(e) => {activeDay(e, week[0], index)}}>
    
                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                        :
    
                                                        
                                                        activeDate !== null && curWeek[index] && (curWeek[index].toString() + time === activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours()))      
                                                            ?
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1))))  ? 'fill-cell active event':  'fill-cell active'} onClick={(e) => {activeDay(e, week[0], index)}}>
    
                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                            :
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1)))) ? 'fill-cell event' : 'fill-cell'} onClick={(e) => {activeDay(e, week[0], index)}}>
    
                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                )}
                                            </tr>
                                    )}
                                </tbody>
        
                            </table>
                        </div>  
                    </div>
                    {activeDate !== null &&
                            <div className="event-container">
                                {activeDate.getTime() >= new Date().getTime() &&  
                                    <div>
                                        {props.role === 'admin' &&
                                            <MyButton onClick={()=>{props.setModalActive(1)}}>Створити нову подію</MyButton>
                                        }
                                    </div>
                                }
                               
                                {dateEvents.includes(activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours())) || 
                                dateEvents.includes(activeDate.getDate().toString() + ((+activeDate.getHours() + 1).toString().length === 1 ? '0' + (+activeDate.getHours() + 1): +activeDate.getHours() + 1))
                                ?   
                                <div className="all-events-on-day">
                                    {events.filter(event => 
                                        event.date.getDate().toString() + (event.date.getHours().toString().length === 1 ? '0' + event.date.getHours(): event.date.getHours()) === 
                                        activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours()) ||
                                        event.date.getDate().toString() + (event.date.getHours().toString().length === 1 ? '0' + event.date.getHours(): event.date.getHours()) === 
                                        activeDate.getDate().toString() + ((+activeDate.getHours() + 1).toString().length === 1 ? '0' + (+activeDate.getHours() + 1): +activeDate.getHours() + 1) 
                                        )
                                        .map(curEvent => 
                                            <OneEvent event={curEvent} key={curEvent.id} setModalActive={props.setModalActive} dataInputed={dataInputed} setDataInputed={setDataInputed} fetchEvents={fetchEvents} role={props.role} typeCalendar={'ordinary'}/>
                                        )
                                    }
                                </div>
                                :
                                    <p className="no-events">Немає подій цього дня</p>
                                }
                            </div>
                        }         
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
                        <p>Відбувається завантаження даних. Зачекайте...</p>
                    </div>
                    <div className="loader-container">
                        <MyLoader />
                    </div>
                    <div className="fake-posts"></div>
                    
                </div>
            );
        }
        else {
            return (
                <div className="week-container">
                    <p className="up-part-title">Оберіть дату</p>
                    <div className="up-part">
                        <div onClick={monthLess}><i className="fa fa-caret-square-o-left" aria-hidden="true"></i></div>
                        <p className="current-date">{getTitleMonth(selectedDate, curWeek)} </p>
                        <div onClick={monthMore}><i className="fa fa-caret-square-o-right" aria-hidden="true"></i></div>
                    </div>
                    <div className="select-container">
                        <Select 
                            className='select-create' 
                            name="roles" 
                            value={{value: getNameMonth(selectedDate.getMonth(), 1), label: getNameMonth(selectedDate.getMonth(), 1)}}
                            isClearable={false}
                            placeholder='Категорії'
                            options={arrOfMonth}
                            onChange={(e)=>{
        
                                for(let i = 0; i < arrOfMonth.length; i++){
                                    if(arrOfMonth[i].value === e.value){
                                        let maxDate = (moment(`${selectedDate.getFullYear()}-${i + 1}-10`).endOf('month')._d.getDate());
                                        let date = activeDate ? +activeDate.getDate() : selectedDate.getDate();
                                        let updatedDate = new Date(selectedDate.getFullYear(), i, date > maxDate ? maxDate : date, activeDate ? activeDate.getHours() : +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                        setCurWeek(monthFormated(updatedDate));
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
                            placeholder='Категорії'
                            options={arrOfYear}
                            onChange={(e)=>{
                                let maxDate = (moment(`${e.value}-${selectedDate.getMonth() + 1}-10`).endOf('month')._d.getDate());
                                let updatedDate = new Date(e.value, selectedDate.getMonth(), +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
                                setCurWeek(monthFormated(updatedDate));
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
        
        
                    <p className="center-container-title">Календар</p>
                    <div className="center-container">
                        <div className="title-time">  
                            <p>00:00</p>
                            <p>02:00</p>
                            <p>04:00</p>
                            <p>06:00</p>
                            <p>08:00</p>
                            <p>10:00</p>
                            <p>12:00</p>
                            <p>14:00</p>
                            <p>16:00</p>
                            <p>18:00</p>
                            <p>20:00</p>
                            <p>22:00</p>
                            <p>24:00</p>
                            
                        </div>
                        <div className="one-calendar">
                            <table>
                                <thead>
                                    <tr>
                                        {weeks.map(week => <th key={week}>{week}</th>)}
                                    </tr>
                                    <tr>
                                        {curWeek.map((week, index) => <th key={index}>{week}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {month.map((week, indexOfArr) =>
                                        week !== undefined && 
                                            <tr className="row-calendar" key={indexOfArr}>
                                                {week.map((time, index) =>
                                                    
                                                    
                                                    (selectedDate.getFullYear().toString() + selectedDate.getMonth() + curWeek[index] + time) === 
                                                        (new Date().getFullYear().toString() + new Date().getMonth() + new Date().getDate() + (new Date().getHours().toString().length === 1 ? '0' + new Date().getHours():new Date().getHours())) ||  
                                                        (selectedDate.getFullYear().toString() + selectedDate.getMonth() + curWeek[index] + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1))) === 
                                                        (new Date().getFullYear().toString() + new Date().getMonth() + new Date().getDate() + (new Date().getHours().toString().length === 1 ? '0' + new Date().getHours():new Date().getHours())) 
                                                        ?
    
                                                       
                                                        activeDate !== null && curWeek[index] && (curWeek[index].toString() + time === activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours()))
                                                            ?
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1)))) ? 'fill-cell active today event' : 'fill-cell active today' } onClick={(e) => {activeDay(e ,week[0], index)}}> 
                                                                    <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                            :
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1))))  ? 'fill-cell today event' : 'fill-cell today'} onClick={(e) => {activeDay(e, week[0], index)}}>
    
                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                        :
    
                                                        
                                                        activeDate !== null && curWeek[index] && (curWeek[index].toString() + time === activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours()))      
                                                            ?
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1))))  ? 'fill-cell active event':  'fill-cell active'} onClick={(e) => {activeDay(e, week[0], index)}}>
    
                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                            :
                                                            <td key={index} className={curWeek[index] && (dateEvents.includes(curWeek[index].toString() + time) || dateEvents.includes(curWeek[index].toString() + ((+time + 1).toString().length === 1 ? '0' + (+time + 1) : (+time + 1)))) ? 'fill-cell event' : 'fill-cell'} onClick={(e) => {activeDay(e, week[0], index)}}>
    
                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                            </td>
                                                )}
                                            </tr>
                                    )}
                                </tbody>
        
                            </table>
                        </div>  
                    </div>
                    {activeDate !== null &&
                        <div className="event-container">  
                            {dateEvents.includes(activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours())) || 
                            dateEvents.includes(activeDate.getDate().toString() + ((+activeDate.getHours() + 1).toString().length === 1 ? '0' + (+activeDate.getHours() + 1): +activeDate.getHours() + 1))
                            ?   
                            <div className="all-events-on-day">
                                {events.filter(event => 
                                    event.date.getDate().toString() + (event.date.getHours().toString().length === 1 ? '0' + event.date.getHours(): event.date.getHours()) === 
                                    activeDate.getDate().toString() + (activeDate.getHours().toString().length === 1 ? '0' + activeDate.getHours(): activeDate.getHours()) ||
                                    event.date.getDate().toString() + (event.date.getHours().toString().length === 1 ? '0' + event.date.getHours(): event.date.getHours()) === 
                                    activeDate.getDate().toString() + ((+activeDate.getHours() + 1).toString().length === 1 ? '0' + (+activeDate.getHours() + 1): +activeDate.getHours() + 1) 
                                    )
                                    .map(curEvent => 
                                        <OneEvent event={curEvent} key={curEvent.id} setModalActive={props.setModalActive} dataInputed={dataInputed} setDataInputed={setDataInputed} fetchEvents={fetchEvents} typeCalendar={'main'}/>
                                    )
                                }
                            </div>
                            :
                                <p className="no-events">Немає подій цього дня</p>
                            }
                        </div>
                    }
                </div>
            );
        }
    }
}

export default Week;