import Modal from "./Modal/Modal";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import MyInput from "../components/UI/MyInput";
import MyButton from '../components/UI/MyButton';
import Select from 'react-select';

import './Create-calendar.css';

const CreateCalendar = (props) => {
    
    const [error, setError] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const someFoo = (e) => {
        e.preventDefault();
        if(props.dataInputed.title.length <= 6 || props.dataInputed.title.length > 20){
            setError('The name must contain more than 6 and less than 20 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.dataInputed.description.length <= 6){
            setError('The description must contain more than 6 characters');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else{
            if(props.modalActive === 1) {
                props.fetchCreateCalendar();
            }
            else if(props.modalActive === 2){
                props.fetchChangeCalendar();
            }
            props.setModalActive(false);
        }
    }
    useEffect(()=>{
        if(props.modalActive === false) {
            props.setDataInputed({title: '', description:'', id: ''});
        }
    }, [props.modalActive]);
    return(
    <Modal modalActive={props.modalActive} setModalActive={props.setModalActive}>
        <div className="modal-window-calendar-create">
            <form onSubmit={someFoo}>
                <p>Name</p>
                <MyInput 
                    type="text" 
                    placeholder="name" 
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
                {error && <p className="error">{error}</p>}
                {props.modalActive === 1 
                    ?
                    <MyButton type='submit'>Create</MyButton>
                    :
                    <MyButton type='submit'>Change</MyButton>
                }
                
            </form>
        </div>
    </Modal>);
}
export default CreateCalendar;