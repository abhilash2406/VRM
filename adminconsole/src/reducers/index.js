import { combineReducers } from 'redux';
import Cookies from 'js-cookie';

const authInitials = {
  isLogin: Cookies.get('token') ? Cookies.get('token') : null,
  setLoading: null,
  grantedPermissions: [],
  role: '',
  usermail: '',
  userdata: [],
  driverData: [],
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
    case 'SET_USERMAIL':
      return {
        ...state,
        usermail: action.payload,
      };
    case 'SET_USERDATA':
      return {
        ...state,
        userdata: action.payload,
      };
    case 'SET_DRIVER_DETAILS':
      return {
        ...state,
        driverData: action.payload,
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
  imgs: [],
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
    case 'SET_GALLERY':
      return {
        ...state,
        imgs: action.payload,
      };
    default:
      return state;
  }
};

//permission reducer
const permissionInitials = {
  permissions: [],
  roleData: [],
  currentUserPermissions: [],
};
const permissionReducer = (state = permissionInitials, action) => {
  switch (action.type) {
    case 'GET_PERMISSION':
      return {
        ...state,
        permissions: action.payload,
      };

    case 'SET_CURRENT_DATA':
      return {
        ...state,
        currentUserPermissions: action.payload,
      };
    case 'SET_ROLE_DATA':
      return {
        ...state,
        roleData: action.payload,
      };
    case 'SET_GRANTED':
      return {
        ...state,
        grantedPermissions: action.payload,
      };

    default:
      return state;
  }
};

//truck reducer
const truckInitials = {
  brands: [],
  models: [],
  variants: [],
  truckData: [],
  truckDetails: [],
};

const truckReducer = (state = truckInitials, action) => {
  switch (action.type) {
    case 'GET_TRUCK_BRANDS':
      return {
        ...state,
        brands: action.payload,
      };
    case 'GET_TRUCK_MODELS':
      return {
        ...state,
        models: action.payload,
      };
    case 'GET_TRUCK_VARIANTS':
      return {
        ...state,
        variants: action.payload,
      };
    case 'GET_ALL_TRUCKS':
      return {
        ...state,
        truckData: action.payload,
      };
    case 'GET_SELECTED_TRUCKDATA':
      return {
        ...state,
        truckDetails: action.payload,
      };

    default:
      return state;
  }
};

//driver reducer
const driverInitials = {
  driverData: [],
};

const driverReducer = (state = driverInitials, action) => {
  switch (action.type) {
    case 'GET_DRIVER_DATA':
      return {
        ...state,
        driverData: action.payload,
      };

    default:
      return state;
  }
};

//route reducer
const routeInitials = {
  routeData: [],
  trips:[]
};

const routeReducer = (state = routeInitials, action) => {
  switch (action.type) {
    case 'GET_ALL_ROUTE':
      return {
        ...state,
        routeData: action.payload,
      };
      case 'GET_ALL_TRIPS':
      return {
        ...state,
        trips: action.payload,
      };

    default:
      return state;
  }
};

export default combineReducers({
  auth: authReducer,
  msg: msgReducer,
  user: userReducer,
  permissions: permissionReducer,
  truck: truckReducer,
  driver: driverReducer,
  routes: routeReducer,
});
