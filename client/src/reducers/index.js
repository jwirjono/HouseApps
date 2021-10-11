import { combineReducers } from "redux";
import alert from './alert';
import auth from "./auth";
import profile from "./profile";

//to be shown as state
export default combineReducers({
    alert,
    auth,
    profile
});