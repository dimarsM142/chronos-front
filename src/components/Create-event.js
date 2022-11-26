import Modal from "./Modal/Modal";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyInput from "../components/UI/MyInput";
import MyButton from '../components/UI/MyButton';
import Select from 'react-select';
import getNameEvent from "./getNameEvent";
import getNameMonth from "./getNameMonth";
import './Create-event.css';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import uk from 'date-fns/locale/uk';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('uk', uk);


const CreateEvent = (props) => {
    
    const [users, setUsers] = useState([]);
    const activeDate = useSelector( (state) => state.cash.activeDate);
    const [error, setError] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [isDatePicked, setIsDatePicked] = useState(false);

    useEffect(()=>{
        if(props.modalActive === 1){
            if(props.typeOfDuration === 'Тиждень'){
                props.setDataInputed({...props.dataInputed, hours: activeDate.getHours(),  minutes: '00',year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate()});
            }
            else{
                props.setDataInputed({...props.dataInputed, year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate()});
            }
            
        }
        else if(props.modalActive === 3) {
            props.setDataInputed({...props.dataInputed, year: activeDate.getFullYear(), month: activeDate.getMonth(), day: activeDate.getDate()});
        }
        else if( props.modalActive === false) {
            props.setDataInputed({id: '', title: '', description:'', hours:new Date().getHours(), minutes: new Date().getMinutes(), year:'', month:'', day:'', type:'reminder', duration: ''});
        }
    }, [props.modalActive]);
    const someFoo = (e) =>{
        
        e.preventDefault();
        if(props.dataInputed.title.length < 6 || props.dataInputed.title.length >= 20){
            setError('Назва повинна містити більше 6 символів та менше 20 символів');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.dataInputed.description.length < 8){
            setError('Опис повинен містити більше 8 символів');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(!props.dataInputed.hours || !props.dataInputed.minutes){
            setError('Заповніть поле часу');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.modalActive == 2 && (!props.dataInputed.year || !props.dataInputed.month || !props.dataInputed.day)){
            setError('Оберіть дату');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if((new Date(props.dataInputed.year, props.dataInputed.month, props.dataInputed.day , props.dataInputed.hours, props.dataInputed.minutes).getTime() < new Date().getTime())){
            setError('Не можна запланувати подію на минуле');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        else if(props.dataInputed.type === 'arrangement'){
            
            if(props.dataInputed.duration.indexOf('.', props.dataInputed.duration.indexOf('.') + 1) !== -1){
                setError('Введіть коректно тривалість даної зустрічі');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);
                return;
            }
            else if(+props.dataInputed.duration < 0.1){
                
                setError('Введіть тривалість даної зустрічі, більшу за 0.1 годину');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);
                return;
            }
            else {
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

    return(
        <Modal modalActive={props.modalActive} setModalActive={props.setModalActive}>
            <div className="modal-window-with-date">
                {props.modalActive == 1
                    &&
                    <div className="date-title">
                        {activeDate &&
                            <p>{activeDate.getDate() + " " + getNameMonth(activeDate.getMonth(), 0) + " " + activeDate.getFullYear() + " року"}</p>
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
                                <span className="input-file-text">{startDate.getDate() + " " + getNameMonth(startDate.getMonth(), 0)  + " " + startDate.getFullYear()}</span>
                                :
                                <span className="input-file-text">Оберіть дату</span>
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
                                    <span className="input-file-text">{startDate.getDate() + " " + getNameMonth(startDate.getMonth(), 0)  + " " + startDate.getFullYear()}</span>
                                    :
                                    <span className="input-file-text">Оберіть дату</span>
                                }
                                
                            </label>
                        </div>                        
                    </div>
                }
               
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

                    <p className="title-time">Час</p>
                    <div className="time-container">
                        <MyInput 
                            type="text" 
                            value={props.dataInputed.hours} 
                            onChange={e => {
                                if(e.target.value.length - props.dataInputed.hours.length < 0){
                                    props.setDataInputed({...props.dataInputed, hours: e.target.value});
                                }
                                else if(!e.target.value || e.target.value[e.target.value.length - 1].match(/\d/)) {
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
                                    setError("Ви можете вводити лише цифри");
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
                                else if(!e.target.value || e.target.value[e.target.value.length - 1].match(/\d/)) {
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
                                    setError("Ви можете вводити лише цифри");
                                    const id = setTimeout(()=>{setError('')}, 2000);
                                    setCurTimeoutID(id);
                                    setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                }
                            }}
                        />
                    </div>
                    <p className="title-select">Тип</p>
                    <Select 
                        className='select-create' 
                        name="roles" 
                        value={{value: props.dataInputed.type, label: getNameEvent(props.dataInputed.type)}}
                        defaultValue={{value: props.dataInputed.type, label: props.dataInputed.type}}
                        isClearable={false}
                        isSearchable={false}
                        placeholder='Категорії'
                        options={[{value: 'reminder', label: 'Нагадування'}, {value: 'task', label: 'Завдання'}, {value: 'arrangement', label: 'Зустріч'}]}
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
                            <p>Тривалість (в годинах)</p>    
                            <MyInput 
                                type="text" 
                                value={props.dataInputed.duration} 
                                onChange={e => {
                                    if(e.target.value.length - props.dataInputed.duration.length < 0){
                                        props.setDataInputed({...props.dataInputed, duration: e.target.value});
                                    }
                                    else if(!e.target.value || e.target.value[e.target.value.length - 1].match(/[\d|.]/)) {
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
                                        setError("Ви можете вводити лише цифри або крапку");
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
                        <MyButton type='submit'>Змінити</MyButton>
                        :
                        <MyButton type='submit'>Створити</MyButton>
                    }
                    
                </form>
            </div>
        </Modal>
    );
}

export default CreateEvent;