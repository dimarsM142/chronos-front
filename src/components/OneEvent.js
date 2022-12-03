import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import getNameEvent from "./getNameEvent";
import getNameMonth from "./getNameMonth";
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import { useNavigate } from "react-router-dom";

import './OneEvent.css';

function checkHours(index){
    switch (+index) {
        case 1:
            return 'hour';
        default:
            return 'hours';
    }
}

const OneEvent = (props) => {
    const router = useNavigate();
    
    const changePost = (e) =>{
        e.stopPropagation();
        props.setDataInputed({...props.dataInputed, id: props.event.id, title: props.event.title, description: props.event.description, hours: props.event.date.getHours().toString(), minutes: props.event.date.getMinutes().toString(), type: props.event.type, duration:props.event.duration.toString(), users: [{id: 21, login: 'dimars'}], category: props.event.category, color: props.event.color});
        props.setModalActive(3);
    }
    const [fetchDeleteEvent, isDeleteEventLoading, deleteEventError] = useFetching(async () => {
        await PostService.deleteEvent(
            localStorage.getItem('access'), 
            window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10),
            props.event.id
        );
        props.fetchEvents();
    })

    useEffect(()=>{
        if(deleteEventError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[deleteEventError]);
    console.log(props.event);
    return (
        <div className={props.event.type === 'holiday' ? 'one-event type-holiday' : "one-event type-" + props.event.color} 
            onClick={()=>{
                if(props.typeCalendar === 'ordinary' && props.role === 'admin') 
                    router(`/calendars/${window.location.pathname.slice(window.location.pathname.indexOf('calendars/') + 10)}/events/${props.event.id}`)
            }}
            >
            <p className="title">{props.event.title}</p>
            <p className="type">{getNameEvent(props.event.type)}</p>
            {props.isSmall 
                ?
                <div className="time">
                    <div className="time-time">
                        {props.typeCalendar !== 'main' && 
                            <p>{props.event.date.getHours().toString().length === 1 ? '0' + props.event.date.getHours() : props.event.date.getHours()}:{props.event.date.getMinutes().toString().length === 1 ? '0' + props.event.date.getMinutes() : props.event.date.getMinutes()}</p>
                        }
                    </div>
                    <p className="time-date">{getNameMonth(props.event.date.getMonth(), 0)} {props.event.date.getDate()}, {props.event.date.getFullYear()}</p>
                </div>
                :
                <div className="time">
                    {props.typeCalendar !== 'main' && 
                        <p>{props.event.date.getHours().toString().length === 1 ? '0' + props.event.date.getHours() : props.event.date.getHours()}:{props.event.date.getMinutes().toString().length === 1 ? '0' + props.event.date.getMinutes() : props.event.date.getMinutes()}</p>
                    }
                </div>

            }
           
            {props.event.type === 'arrangement' 
                ?
                <div className="duration">
                    <p>Lasts {props.event.duration} {checkHours(props.event.duration)}</p>
                </div>
                
                :
                <div className="duration"></div>
            }
           
            {props.event.date.getTime() > new Date().getTime()
                ?
                <div className="change"> 
                    {props.role === 'admin' && 
                        <div>
                            {!props.isSmall &&
                                <>
                                    {props.event.type === 'arrangement'
                                        ?
                                        <>
                                            {props.event.login === localStorage.getItem('login') ?
                                                <div>
                                                    <i onClick={changePost} className="fa fa-pencil-square" aria-hidden="true"></i>
                                                    <i onClick={(e) => {e.stopPropagation(); fetchDeleteEvent()}} className="fa fa-times" aria-hidden="true"></i>
                                                </div>
                                                :
                                                <>
                                                    {props.isOwner &&
                                                        <div>
                                                            <i onClick={(e) => {e.stopPropagation(); fetchDeleteEvent()}} className="fa fa-times" aria-hidden="true"></i>
                                                        </div>
                                                    }
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <div>
                                                <i onClick={changePost} className="fa fa-pencil-square" aria-hidden="true"></i>
                                                <i onClick={(e) => {e.stopPropagation(); fetchDeleteEvent()}} className="fa fa-times" aria-hidden="true"></i>
                                            </div>
                                        </>
                                    }
                                </>
                            }
                        </div>
                    }
                </div> 
                :
                <div className="change"><div></div></div>
            }
           
        </div>
    );
}

export default OneEvent;


