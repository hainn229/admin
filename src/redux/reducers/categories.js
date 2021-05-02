import * as Types from "../../constants/constants";
let defaultState = {
  data: [],
};
let categoriesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case Types.CATEGORIES: {
      return { ...state, data: action.payload };
    }
    default:
      return state;
  }
};
export default categoriesReducer;
