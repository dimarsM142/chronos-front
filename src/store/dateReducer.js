const defaultState = {
    curDate : Date.now(),
    todayDate: Date.now(),
    activeDate: null

}

const ADD_DATE = "ADD_DATE";
const ADD_ACTIVE_DATE = "ADD_ACTIVE_DATE";
export const dateReducer = (state = defaultState, action) =>{
    switch (action.type){
        case ADD_DATE:
            return {...state, curDate: action.payload};
        case ADD_ACTIVE_DATE:
            return {...state, activeDate: action.payload};
        default:
            return state;
    }
}

export const addDateAction = (payload) =>({type: ADD_DATE, payload});
export const addActiveAction = (payload) =>({type: ADD_ACTIVE_DATE, payload});