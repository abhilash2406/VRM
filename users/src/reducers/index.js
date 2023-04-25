import { combineReducers } from 'redux';
import Cookies from 'js-cookie';

const authInitials = {
  isLogin: Cookies.get('token') ? Cookies.get('token') : null,
  setLoading: null,
  grantedPermissions: [],
  role: '',
  imgs: [],
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
    case 'SET_GALLERY':
      return {
        ...state,
        imgs: action.payload,
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

export default combineReducers({
  auth: authReducer,
  msg: msgReducer,
});
