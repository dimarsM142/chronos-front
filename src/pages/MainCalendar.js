import React, {useState, useEffect } from "react";

import MyButton from '../components/UI/MyButton';
import Select from 'react-select';
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import Month from "../components/Duration/Month";
import MyLoader from "../components/UI/MyLoader2";
import OneEvent from "../components/OneEvent";
import Week from "../components/Duration/Week";
import Year from "../components/Duration/Year";
import MySearch from "../components/UI/MySearch";
import './Calendar.css';

const Calendar = (props) => {
    const [modalActive, setModalActive] = useState(false);
    const [typeOfDuration, setTypeOfDuration] = useState('Month');
    
    const [isSearchedEvents, setIsSearchedEvents] = useState(false); 
    const [events, setEvents] = useState([]); 
    const [name, setName] = useState('');
    const [dataInputed, setDataInputed] = useState({id: '', title: '', description: '', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: ''});
   
    const [fetchEvents, isEventsLoading, eventsError] = useFetching(async () => {
        const response = await PostService.getEventsByName(
            localStorage.getItem('access'), 
            +window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10),
            name);
        let arr = [];
        for(let i = 0; i < response.data.length; i++){
            arr[i] = {id: response.data[i].id, title: response.data[i].title, description: response.data[i].description, date: new Date(response.data[i].execution_date),  type: response.data[i].type,  duration:  Math.ceil((response.data[i].duration / 3600) * 100) / 100};
        }
        setEvents(arr);
    })

    const searchEvents = () =>{
        if(name.length >= 3){
            setIsSearchedEvents(true);
            fetchEvents();
        }
        
    }
    useEffect(()=>{
        if(eventsError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[eventsError]);

    if(isEventsLoading)
    {
        return(
            <div className="loading-calendar">  
                <div className="loading-test">
                    <p>Data is being loaded. Wait..</p>
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
            <div className="calendar-container">
                    
                <div className="up-button">                
                    <div>
                        <Select 
                            className='select-create-user' 
                            name="roles" 
                            value={{value: typeOfDuration, label: typeOfDuration}}
                            isClearable={false}
                            options={[{value: 'Week', label: 'Week'}, {value: 'Month', label: 'Month'}, {value: 'Year', label: 'Year'}]}
                            onChange={(e)=>{setTypeOfDuration(e.value)}} 
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
                </div>
                {isSearchedEvents &&
                    <div className="up-event-container">
                        <div className="delete">
                            <i onClick={() => {setIsSearchedEvents(false); setEvents([]); setName('');}} className="fa fa-times" aria-hidden="true"></i>
                        </div>
                        <div>
                            {events.length === 0 
                                ?
                                <p className="no-events-text">There are no such events in this calendar :(</p>
                                :
                                <div>
                                    <p className="events-title">Events</p>
                                    <div className="events">
                                    {events.map(curEvent => 
                                            <OneEvent event={curEvent} key={curEvent.id} setModalActive={setModalActive} fetchEvents={fetchEvents} role={role} dataInputed={dataInputed} setDataInputed={setDataInputed} isSmall={true}/>
                                        )}
                                    </div>
                                </div>
                                
                            }
                        </div>
                    </div>
                }
                {typeOfDuration === 'Month' &&
                    <Month modalActive={modalActive} setModalActive={setModalActive} typeOfDuration={typeOfDuration} typeCalendar={'main'}/>
                }
                {typeOfDuration === 'Week' &&
                    <Week modalActive={modalActive} setModalActive={setModalActive} typeOfDuration={typeOfDuration} typeCalendar={'main'}/>
                }
                 {typeOfDuration === 'Year' &&
                    <Year modalActive={modalActive} setModalActive={setModalActive} setTypeOfDuration={setTypeOfDuration} typeOfDuration={typeOfDuration}/>
                }
                
            </div>
        );
    }
}

export default Calendar;

