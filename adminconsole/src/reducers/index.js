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

export default combineReducers({
  auth: authInitials,
});
