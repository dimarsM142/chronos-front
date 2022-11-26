import React from "react";

import './Subscriber.css';


const Subscriber = (props) => {
    return(
        <>
            <div key={props.user.user_id} className='modal-one-user'>
                <div className="modal-one-user-up-part">
                    <p className='modal-one-user-title'>{props.user.login} </p>
                    
                    <div className="modal-one-user-change">
                        <i className="fa fa-pencil" aria-hidden="true" onClick={e => {e.stopPropagation(); props.changeSubscribedUserRole(props.user.user_id, (props.user.role === 'user')?('admin'):('user'))}}></i>
                        <i className="fa fa-times" aria-hidden="true" onClick={() => (props.unsubscribeUserFromCalendar(props.user.user_id))}></i>
                    </div>
                </div>
                <p className='modal-one-user-role'>
                    {props.user.role === 'user' 
                        ?
                        "Користувач"
                        :
                        "Адміністратор"     
                    } 
                </p>
            </div>
        </>
    );
}

export default Subscriber;