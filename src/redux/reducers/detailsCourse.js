import * as Types from "../../constants/constants";
let defaultState = {
  data: [],
};
let detailsCourseReducer = (state = defaultState, action) => {
  switch (action.type) {
    case Types.COURSE_DETAILS: {
      return { ...state, data: action.payload };
    }
    default:
      return state;
  }
};
export default detailsCourseReducer;
