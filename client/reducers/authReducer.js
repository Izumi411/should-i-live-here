import { SIGN_IN, REGISTER, LOGOUT, SEARCH_HISTORY } from '../constants/actionTypes';

const initialState = {
  currentUser: null,
  isLogged: false,
  searchHistory: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      console.log('payload:', action.payload);
      if (!action.payload.email && !action.payload) {
        return state;
      }
      return {
        ...state,
        currentUser: action.payload,
        isLogged: true,
      };
    case REGISTER:
      return {
        ...state,
        currentUser: action.payload,
        isLogged: true,
      };
    case LOGOUT:
      return {
        ...state,
        currentUser: null,
        isLogged: false,
      };
    case SEARCH_HISTORY: 
      return {
        ...state, 
        searchHistory: true,
      };
    default: return state;
  }
};

export default authReducer;
