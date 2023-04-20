import { combineReducers } from 'redux';
import Cookies from 'js-cookie';

const authInitials = {
  isLogin: Cookies.get('token') ? Cookies.get('token') : null,
  setLoading: null,
  grantedPermissions: [],
  role: '',
};
const authReducer = (state = authInitials, action) => {
  switch (action.type) {
    case 'GET_LOGIN':
      return {
        ...state,
        isLogin: Cookies.get('token'),
        role: action.payload,
        grantedPermissions: action.permission,
      };

    case 'LOGOUT':
      return {
        ...state,
        isLogin: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        setLoading: action.payload,
      };

    default:
      return state;
  }
};

// msg reducer
const msgInitials = {
  successMsg: '',
  errorMsg: '',
};

const msgReducer = (state = msgInitials, action) => {
  switch (action.type) {
    case 'SUCCESS_MESSAGE':
      return {
        ...state,
        successMsg: action.payload,
      };
    case 'ERROR_MESSAGE':
      return {
        ...state,
        errorMsg: action.payload,
      };

    default:
      return state;
  }
};

const userInitials = {
  userData: '',
  feedbacks: [],
  feedback: '',
  designations: [],
};

const userReducer = (state = userInitials, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
      };
    case 'SET_USER_FEEDBACKS':
      return {
        ...state,
        feedbacks: action.payload,
      };
    case 'SET_USER_FEEDBACK':
      return {
        ...state,
        feedback: action.payload,
      };
    case 'SET_DESIGNATIONS':
      return {
        ...state,
        designations: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  auth: authReducer,
  msg: msgReducer,
  user: userReducer,
});
