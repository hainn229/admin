import * as Types from "../../constants/constants";
let defaultState = {
  data: [],
};
let searchReducer = (state = defaultState, action) => {
  switch (action.type) {
    case Types.SEARCH: {
      return { ...state, data: action.payload };
    }
    default:
      return state;
  }
};
export default searchReducer;
