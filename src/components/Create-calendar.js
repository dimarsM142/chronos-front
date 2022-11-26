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
            setError('Назва повинна містити більше 6 та менше 20 символів');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.dataInputed.description.length <= 6){
            setError('Опис повинен містити більше 6 символів');
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
                <p>Назва</p>
                <MyInput 
                    type="text" 
                    placeholder="Назва" 
                    value={props.dataInputed.title} 
                    onChange={e => {
                        if(e.target.value.length - props.dataInputed.title.length < 0){
                            props.setDataInputed({...props.dataInputed, title: e.target.value});
                        }
                        else if(e.target.value.length > 20){
                            clearTimeout(curTimeoutID);
                            e.target.style.outline = '2px red solid';
                            setError("Максимальна довжина вашого імені 20 символи");
                            const id = setTimeout(()=>{setError('')}, 2000);
                            setCurTimeoutID(id);
                            setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                        }
                        else {
                            props.setDataInputed({...props.dataInputed, title: e.target.value});
                        }
                    }}
                />
                <p className="title-desc">Опис</p>
                <textarea placeholder="Введіть опис календаря..." value={props.dataInputed.description} onChange={e => {props.setDataInputed({...props.dataInputed, description: e.target.value});}}/>
                {error && <p className="error">{error}</p>}
                {props.modalActive === 1 
                    ?
                    <MyButton type='submit'>Створити</MyButton>
                    :
                    <MyButton type='submit'>Змінити</MyButton>
                }
                
            </form>
        </div>
    </Modal>);
}
export default CreateCalendar;