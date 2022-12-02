import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDateAction, addActiveAction} from "../../store/dateReducer";
import PostService from "../../API/PostService";
import { useFetching } from "../../hooks/useFetching";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import CreateEvent from "../Create-event.js";
import Select from 'react-select';
import MyLoader from "../UI/MyLoader2";
import OneSmallMonth from "../One-small-month";
import './Year.css';

const arrOfYear =  [];

const Year = (props) => {
    
    const router = useNavigate();
    const dispatch = useDispatch();
    const selectedDate = new Date(useSelector( (state) => state.cash.curDate));

    const activeDate = useSelector( (state) => state.cash.activeDate);
    const [dataInputed, setDataInputed] = useState({id: '', title: '', description: '', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: '', users: [], category: 'work', color: 'red'});
    const year = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    
   
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
    })
    
   
    useEffect(()=>{
        for(let i = 0; i < 20; i++){
            arrOfYear[i] = { value: selectedDate.getFullYear() - 10 + i, label: selectedDate.getFullYear() - 10 + i};
        }
    
    }, []);
    useEffect(()=>{
        if(createEventError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[createEventError]);

    const monthLess = () =>{   
        let updatedDate;
        if(selectedDate.getFullYear() - 1 < 1970){
            updatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedDate.getHours(), +new Date().getMinutes(), +new Date().getSeconds());
        }
        else{
            updatedDate = new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), selectedDate.getDate(), selectedDate.getHours(), +new Date().getMinutes(), +new Date().getSeconds());
        }
        
        dispatch(addDateAction(updatedDate.getTime()));
        if(activeDate) {
            dispatch(addActiveAction(updatedDate));
        }
        for(let i = 0; i < 20; i++){
            if(selectedDate.getFullYear() - 11 >= 1970){
                arrOfYear[i] = { value: selectedDate.getFullYear() - 11 + i, label: selectedDate.getFullYear() - 11 + i};
            }
            else{
                arrOfYear[i] = { value: 1970 + i, label: 1970 + i};
            }
        }
    }   
    
    const monthMore = () =>{
        let updatedDate = new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), selectedDate.getDate(), selectedDate.getHours(), +new Date().getMinutes(), +new Date().getSeconds());
        dispatch(addDateAction(updatedDate.getTime()));
        if(activeDate) {
            dispatch(addActiveAction(updatedDate));
        }
        for(let i = 0; i < 20; i++){
            if(selectedDate.getFullYear() - 9 >= 1970){
                arrOfYear[i] = { value: selectedDate.getFullYear() - 9 + i, label: selectedDate.getFullYear() - 9 + i};
            }
            else{
                arrOfYear[i] = { value: 1970 + i, label: 1970 + i};
            }
        }
    }   
    
    if(isCreateEventLoading){
        
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
            <div className="year-container">
                <p className="up-part-title">Select a date</p>
                <div className="up-part">
                    <div onClick={monthLess}><i className="fa fa-caret-square-o-left" aria-hidden="true"></i></div>
                    <p className="current-date">{selectedDate.getFullYear() + " рік"} </p>
                    <div onClick={monthMore}><i className="fa fa-caret-square-o-right" aria-hidden="true"></i></div>
                </div>
                <div className="select-container">
                    <Select 
                        className='select-create' 
                        name="roles" 
                        value={{value: selectedDate.getFullYear(), label: selectedDate.getFullYear()}}
                        isClearable={false}
                        options={arrOfYear}
                        onChange={(e)=>{
                            let maxDate = (moment(`${e.value}-${selectedDate.getMonth() + 1}-10`).endOf('month')._d.getDate());
                            let updatedDate = new Date(e.value, selectedDate.getMonth(), +selectedDate.getDate() > maxDate ? maxDate : selectedDate.getDate(), +new Date().getHours(), +new Date().getMinutes(), +new Date().getSeconds());
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
                    {year.map((month, index)=> <OneSmallMonth key={month} month={month} year={selectedDate.getFullYear()} setTypeOfDuration={props.setTypeOfDuration}/>)} 
                </div>
                <CreateEvent 
                    modalActive={props.modalActive} 
                    setModalActive={props.setModalActive} 
                    fetchCreateEvent={fetchCreateEvent} 
                    dataInputed={dataInputed}
                    setDataInputed={setDataInputed}
                    typeOfDuration={props.typeOfDuration}
                />
            </div>
        );
    }
}

export default Year;