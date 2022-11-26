import React, { useEffect, useState } from "react";
import OneCalendar from "../components/One-calendar";
import PostService from "../API/PostService";
import Select from "react-select";
import { useFetching } from "../hooks/useFetching";
import CreateCalendar from "../components/Create-calendar";
import './All-calendars.css';
import MyButton from "../components/UI/MyButton";
import Modal from "../components/Modal/Modal";
import Subscriber from "../components/Subscriber";
import SubscribeUser from "../components/SubscribeUser";
import MyLoader from '../components/UI/MyLoader.js';
import MyLoader2 from '../components/UI/MyLoader2.js';
import OneMainCalendar from "../components/One-mainCalendar";

const AllCalendars = (props) => {
    const [dataInputed, setDataInputed] = useState({title:'', description: '', id: ''});
    const [modalActive, setModalActive] = useState(false);
    const [calendars, setCalendars] = useState([]);
    const [mainCalendar, setMainCalendar] = useState({});
    const [typeOfCalendars, setTypeOfCalendars] = useState({value:'own',label:'Ваші календарі'});
    const [showInputForSubsUser,setShowInputForSubsUser] = useState(false);
    const [checkAllSubsedUsers, setCheckAllSubsedUsers] = useState(false);
    const [showAllSubsedUsers, setShowAllSubsedUsers] = useState([]);
    const [curCalendarCreate, setCalendarCreate] = useState({title:'', id:''});
    const [roleForSubsUser, setRoleforSubsUser] = useState({value: 'user', label: 'Користувач'});
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();

    const [isLoadingGetUsers, setLoadingGetUsers] = useState(false);
    const [isSuccessAdding, setIsSuccessAdding] = useState(false);
    const [fetchCalendars, isCalendarsLoading, calendarError] = useFetching(async () => {
        const response = await PostService.getCalendarsOwn(localStorage.getItem('access'));
        setCalendars(response.data);
    })
    const [fetchCalendarsSubscribed, isCalendarsSubscribedLoading, calendarSubscribedError] = useFetching(async () => {
        const response = await PostService.getCalendarsSubscribed(localStorage.getItem('access'));
        setCalendars(response.data);
    })
    const [fetchMainCalendar, isMainCalendarLoading, mainCalendarError] = useFetching(async () => {
        const response = await PostService.getHolidaysCalendarInfoFromGoogleAPI();
        setMainCalendar(response);
    })
    const [fetchCreateCalendar, isCreateCalendarLoading, createCalendarError] = useFetching(async () => {
        await PostService.createCalendar(localStorage.getItem('access'), dataInputed.title, dataInputed.description);
        if(typeOfCalendars.value === 'own'){
            fetchCalendars();
        }
    })
    const [fetchChangeCalendar, isChangeCalendarLoading, changeCalendarError] = useFetching(async () => {
        await PostService.changeCalendar(localStorage.getItem('access'), dataInputed.id, dataInputed.title, dataInputed.description);
        fetchCalendars();
    })

    useEffect(()=>{
        fetchCalendars();
        fetchMainCalendar();
    }, []);
    

    const [fetchGetSubscribedUser, isGetUserSubscribe, getSubscribeUserError] = useFetching(async (id) => {

        const res = await PostService.getAllUsersSubsedToCalendar(localStorage.getItem('access'), id);
        setShowAllSubsedUsers(res.data);
    })
    const [fetchSubscribeUser, isUserSubscribeLoading, subscribeUserError] = useFetching(async () => {
        clearTimeout(curTimeoutID);
        if(userInput === localStorage.getItem('login')){
            setError('Ви не можете підписати себе на календар!');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);// eslint-disable-next-line
            return;
        }
        else if(userInput.length < 4){
            setError('Немає такого користувача!');
            const id = setTimeout(()=>{setError('')}, 2000);
            setCurTimeoutID(id);// eslint-disable-next-line
            return;
        }
        const response = await PostService.subscribeUserToCalendar(localStorage.getItem('access'), curCalendarCreate.id, userInput, roleForSubsUser.value);
        setIsSuccessAdding(true);
        setShowInputForSubsUser(false);
        setTimeout(()=>{
            setIsSuccessAdding(false);
        },2000);
        
    })
    const [fetchDeleteSubscribeUser, isDeleteUserSubscribe, deleteSubscribeUserError] = useFetching(async (userId) => {
        const response = await PostService.unsubscribeUserFromCalendar(localStorage.getItem('access'), curCalendarCreate.id, userId);
        fetchGetSubscribedUser(curCalendarCreate.id);
        
    })

    const [fetchChangeSubscribeUser, isChangeUserSubscribe, changeSubscribeUserError] = useFetching(async (userId, userRole) => {
        const response = await PostService.changeSubscribedUserRole(localStorage.getItem('access'), curCalendarCreate.id, userId, userRole);
        fetchGetSubscribedUser(curCalendarCreate.id);
        
    })

    useEffect(()=>{
        if(!checkAllSubsedUsers && !showInputForSubsUser && !isSuccessAdding){
            setCalendarCreate({title: '', id: ''});
        }
        if(!showInputForSubsUser){
            setUserInput('');
            setRoleforSubsUser({value: 'user', label: 'Користувач'});
        }
    },[showInputForSubsUser, checkAllSubsedUsers, isSuccessAdding]);
    
    useEffect(()=>{
        if(calendarError || calendarSubscribedError || createCalendarError || changeCalendarError || changeSubscribeUserError || deleteSubscribeUserError || getSubscribeUserError || mainCalendarError){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[calendarError, calendarSubscribedError, createCalendarError, changeCalendarError,changeSubscribeUserError, deleteSubscribeUserError, getSubscribeUserError, mainCalendarError]);


    useEffect(()=>{
        if(isChangeUserSubscribe || isGetUserSubscribe || isDeleteUserSubscribe){
            setLoadingGetUsers(true);
        }
        else{
            setLoadingGetUsers(false);
        }
        
    },[isChangeUserSubscribe, isDeleteUserSubscribe, isGetUserSubscribe])


    

    useEffect(()=>{
        if(subscribeUserError){
            
            if(subscribeUserError.data.comment === "User with this login does not exists!"){
                setError('Користувача з таким логіном не існує!');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);// eslint-disable-next-line
            }
            else if(subscribeUserError.data.comment === "The user is already subscribed to this calendar!"){
                setError('Даний користувач вже є підписаним на ваш календар!');
                const id = setTimeout(()=>{setError('')}, 2000);
                setCurTimeoutID(id);
            }
            else {
                router('/error');
            }
        }
    }, [subscribeUserError])


    if(isCalendarsLoading || isCalendarsSubscribedLoading || isCreateCalendarLoading || isChangeCalendarLoading || isMainCalendarLoading){
        return(
            <div className="loading-posts">
                <div className="fake-posts-container">
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                </div>
                <div className="loading-test">
                    <p>Відбувається завантаження даних. Зачекайте...</p>
                </div>
                <div className="loader-container">
                    <MyLoader2 />
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="all-calendars-container">
                <div className="up-container">
                    <MyButton onClick={()=>{setModalActive(1)}}>Створити календар</MyButton>
                    <Select 
                        className='select-create' 
                        name="roles" 
                        value={{value: typeOfCalendars.value, label: typeOfCalendars.label}}
                        isClearable={false}
                        options={[{value: 'own', label: 'Ваші календарі'}, {value: 'subscribed', label: 'Ваші підписки'}]}
                        onChange={(e)=>{
                            setTypeOfCalendars(e)
                            if(e.value === 'own'){
                                fetchCalendars();
                            }
                            else{
                                fetchCalendarsSubscribed();
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
                {typeOfCalendars.value === 'own' 
                    ?
                    <div>
                        <p className="all-calendars-container-active-title">Ваші календарі</p>
                        <div className="all-calendars-container-active-content">
                            {typeOfCalendars.value === 'own' &&
                                <OneMainCalendar 
                                    calendar={mainCalendar} 
                                    key={'mainCalendarKey'} 
                                    fetchCalendars={fetchMainCalendar} 
                                    typeOfCalendars={{value:'own',label:'Ваші календарі'}}
                                    modalActive={modalActive}
                                    setModalActive={setModalActive}
                                    setDataInputed={setDataInputed}
                                />
                            }
                            {calendars.map((calendar) =>
                                <OneCalendar 
                                    calendar={calendar} 
                                    key={calendar.id} 
                                    fetchCalendars={fetchCalendars} 
                                    fetchCalendarsSubscribed={fetchCalendarsSubscribed}
                                    typeOfCalendars={typeOfCalendars}
                                    modalActive={modalActive}
                                    setModalActive={setModalActive}
                                    setDataInputed={setDataInputed}
                                    setCheckAllSubsedUsers={setCheckAllSubsedUsers}
                                    fetchGetSubscribedUser={fetchGetSubscribedUser}
                                    showInputForSubsUser={showInputForSubsUser}
                                    setShowInputForSubsUser={setShowInputForSubsUser}
                                    curCalendarCreate={curCalendarCreate}
                                    setCalendarCreate={setCalendarCreate}
                                />
                            )}
                        </div>
                    </div>
                    :
                    <div>
                        {calendars.length !== 0 
                            ?
                            <div>
                                <p className="all-calendars-container-active-title">Календарі, на які ви підписані</p>
                                <div className="all-calendars-container-active-content">
                                    {calendars.map((calendar) =>
                                        <OneCalendar 
                                            calendar={calendar} 
                                            key={calendar.id} 
                                            fetchCalendars={fetchCalendars} 
                                            fetchCalendarsSubscribed={fetchCalendarsSubscribed}
                                            typeOfCalendars={typeOfCalendars}
                                            modalActive={modalActive}
                                            setModalActive={setModalActive}
                                            setDataInputed={setDataInputed}
                                            setCheckAllSubsedUsers={setCheckAllSubsedUsers}
                                            fetchGetSubscribedUser={fetchGetSubscribedUser}
                                            showInputForSubsUser={showInputForSubsUser}
                                            setShowInputForSubsUser={setShowInputForSubsUser}
                                            curCalendarCreate={curCalendarCreate}
                                            setCalendarCreate={setCalendarCreate}
                                        />
                                    )}
                                </div>
                            </div>
                            :
                            <p className="all-calendars-container-not-active-title">Немає календарів :(</p>
                        }
                        
                    </div>    
                }                        
                <CreateCalendar 
                    modalActive={modalActive} 
                    setModalActive={setModalActive} 
                    dataInputed={dataInputed} 
                    setDataInputed={setDataInputed} 
                    fetchCreateCalendar={fetchCreateCalendar}
                    fetchChangeCalendar={fetchChangeCalendar}

                    
                />
                <Modal modalActive={checkAllSubsedUsers} setModalActive={setCheckAllSubsedUsers}>
                    {isLoadingGetUsers 
                        ?
                        <div className="loading">
                            <div className="modal-up-title-container">
                                <p className="modal-title">Календар</p>
                                <p className="modal-calendar-name">{curCalendarCreate.title}</p>
                            </div>
                            <div className="modal-content-container">
                                <div>
                                    <MyLoader />
                                </div>
                                <p>Відбувається завантаження ...</p>
                            </div>
                        </div>    
                        :
                        <div className="modal-get-users">
                            <div className="modal-up-title-container">
                                <p className="modal-title">Календар</p>
                                <p className="modal-calendar-name">{curCalendarCreate.title}</p>
                            </div>
                            {showAllSubsedUsers.length === 0
                                ?
                                <p className="modal-no-subs">Даний календар не має підписників :(</p>
                                :
                                <div className="modal-all-users">
                                    <p className="modal-all-users-title">Підписники</p>
                                    <div className="modal-all-users-content">
                                        {showAllSubsedUsers.map((user) =>
                                            <Subscriber key={user.user_id} user={user} changeSubscribedUserRole={fetchChangeSubscribeUser} unsubscribeUserFromCalendar={fetchDeleteSubscribeUser}/>
                                        )}
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    
                </Modal>
                {isUserSubscribeLoading
                    ?
                        <Modal modalActive={true}  setModalActive={()=>{}}>
                            <div className="loading">
                                <div className="modal-up-title-container">
                                    <p className="modal-title">Календар</p>
                                    <p className="modal-calendar-name">{curCalendarCreate.title}</p>
                                </div>
                                <div className="modal-content-container">
                                    <div>
                                        <MyLoader />
                                    </div>
                                    <p>Відбувається завантаження ...</p>
                                </div>
                            </div>    
                        </Modal>
                    :
                    <SubscribeUser

                        showInputForSubsUser={showInputForSubsUser} 
                        setShowInputForSubsUser={setShowInputForSubsUser}
                        calendarTitle={curCalendarCreate.title}
                        calendarId={curCalendarCreate.id}
                        userInput={userInput}
                        handleLoginUserChange={setUserInput}
                        roleForSubsUser={roleForSubsUser}
                        setRoleforSubsUser={setRoleforSubsUser}
                        error={error}
                        setError={setError}
                        subscribeUserToCalendar={fetchSubscribeUser}
                    />
                }
                {isSuccessAdding &&
                    <Modal modalActive={true} setModalActive={()=>{}}>
                        <div className="successfull-adding">
                            <div className="modal-up-title-container">
                                <p className="modal-title">Календар</p>
                                <p className="modal-calendar-name">{curCalendarCreate.title}</p>
                            </div>
                            <div className="modal-content-container">
                                <i className="fa fa-check-circle-o" aria-hidden="true"></i>
                                <p>Користувача успішно підписано!</p>
                            </div>
                        </div>  
                    </Modal>
                }
               
            </div>
            
        );
    }

}

export default AllCalendars;