import {createStore, combineReducers, applyMiddleware} from "redux";
import { dateReducer } from "./dateReducer";

import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
const rootReducer = combineReducers({
    cash: dateReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));