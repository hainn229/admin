import { combineReducers } from "redux";
import signInReducer from "./signin";
import coursesReducer from "./courses";
import categoriesReducer from "./categories";
import searchReducer from "./search";
import detailsCourseReducer from "./detailsCourse";
export const myReducers = combineReducers({
    signInReducer,
    coursesReducer,
    categoriesReducer,
    searchReducer,
    detailsCourseReducer,
});
