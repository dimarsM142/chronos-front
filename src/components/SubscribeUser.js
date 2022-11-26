import Modal from "./Modal/Modal";
import React from "react";
import MyInput from "./UI/MyInput";
import MyButton from './UI/MyButton';
import Select from 'react-select';

import './SubscribeUser.css';

const SubscribeUser = (props) => {
    return(
        <>
            <Modal modalActive={props.showInputForSubsUser} setModalActive={props.setShowInputForSubsUser}>
                <div className="modal-create-user">
                    <div className="modal-up-title-container">
                        <p className="modal-title">Календар</p>
                        <p className="modal-calendar-name">{props.calendarTitle}</p>
                    </div>
                    <div className="modal-create-user-content">
                        <div className='modal-login-input'>
                            <p>Логін користувача</p>
                            <MyInput 
                                type="text"
                                placeholder="Логін" 
                                value={props.userInput}
                                onChange={(e) =>props.handleLoginUserChange(e.target.value)}
                            />
                        </div>
                        <div className='modal-select-role'>
                            <p>Роль нового користувача</p>
                            <Select 
                                className='select-create' 
                                name="roles" 
                                value={{value: props.roleForSubsUser.value, label: props.roleForSubsUser.label}}
                                isClearable={false}
                                    options={[{value: 'user', label: 'Користувач'}, {value: 'admin', label: 'Адміністратор'}]}
                                    onChange={(e)=>{
                                        props.setRoleforSubsUser(e);
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
                        
                            {props.error && <p className="error">{props.error}</p>} 
                            
                        </div>
                        <MyButton onClick={props.subscribeUserToCalendar}>Запросити</MyButton>
                    </div>   
            </Modal>
        </>
    );
}

export default SubscribeUser;