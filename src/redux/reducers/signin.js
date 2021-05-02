import * as Types from "../../constants/constants";

const defaultState = {
  data: {},
};

const signInReducer = (state = defaultState, action) => {
  switch (action.type) {
    case Types.LOGIN_DATA:
      return {
        ...state,
        data: action.payload
      };

    default:
      return state;
  }
};

export default signInReducer;