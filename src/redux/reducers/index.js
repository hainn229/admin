import { combineReducers } from "redux";
import signInReducer from "./signin";
import searchReducer from "./search";
export const myReducers = combineReducers({
    signInReducer,
    searchReducer,
});
