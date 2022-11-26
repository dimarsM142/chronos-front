
import React from "react";
import './Modal.css';

const Modal = ({modalActive, setModalActive, children}) =>{
    return (
        <div className={modalActive ? 'modal active' : 'modal'} onClick={() => setModalActive(false)}>
            <div className={modalActive ? "modal__content active" :"modal__content"} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Modal;