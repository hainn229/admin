import * as Types from "../../constants/constants";
let defaultState = {
  data: [],
};
let coursesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case Types.COURSES: {
      return { ...state, data: action.payload };
    }
    default:
      return state;
  }
};
export default coursesReducer;
