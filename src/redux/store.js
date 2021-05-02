import {
    createStore
} from "redux";
import {
    myReducers
} from "./reducers/index";

const store = createStore(myReducers);

export default store;