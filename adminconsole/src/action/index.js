import Cookies from 'js-cookie';
import { getData, postData, updateData } from '../services';

// for toasters

// toaster for success message
export const setSuccessMessage = (data) => (dispatch) => {
  dispatch({
    type: 'SUCCESS_MESSAGE',
    payload: data,
  });
};

// toaster for error message
export const setErrorMessage = (data) => (dispatch) => {
  dispatch({
    type: 'ERROR_MESSAGE',
    payload: data,
  });
};

// reset  success message toaster
export const resetSuccessMessage = () => (dispatch) => {
  dispatch({
    type: 'SUCCESS_MESSAGE',
    payload: null,
  });
};

// reset error message toaster
export const resetErrorMessage = () => (dispatch) => {
  dispatch({
    type: 'ERROR_MESSAGE',
    payload: null,
  });
};

//for login

export const setLogin = (props, navigate) => async (dispatch) => {
  console.log('props', props);
  await postData('/auth/login', props).then((e) => {
    if (e.data.success) {
      Cookies.set('token', e.data.data.accessToken);
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          token: e.data.data.accessToken,
          designation: e.data.data.designation,
        })
      );
      navigate();
      dispatch(setSuccessMessage(e.data.message));
      dispatch({
        type: 'GET_LOGIN',
        payload: e.data.data.designation,
        permission: e.data.data.permission,
      });
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

// action for logout
export const setLogout = (navigate) => async (dispatch) => {
  localStorage.removeItem('currentUser');
  Cookies.remove('token');
  dispatch(setSuccessMessage('Logout successfully'));
  navigate();
  // await service.userLogout();
};

//for view profile
export const viewProfile = () => async (dispatch) => {
  const { data } = await getData('/profile/view');
  console.log('data', data);
  if (data.success) {
    dispatch({
      type: 'SET_USER_DATA',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//to fetch feedbacks
export const fetchFeedbacks = (id) => async (dispatch) => {
  const { data } = await getData('/profile/feedback');
  if (data.success) {
    dispatch({
      type: 'SET_USER_FEEDBACKS',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//to fetch feedbacks
export const readFeedback = (id) => async (dispatch) => {
  const { data } = await getData(`/profile/feedback/${id}`);
  console.log('data', data);
  if (data.success) {
    dispatch({
      type: 'SET_USER_FEEDBACK',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};
