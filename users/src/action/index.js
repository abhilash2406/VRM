import Cookies from 'js-cookie';
import { setData } from '../services';

export const postLogin = (props, navigate) => async (dispatch) => {
  await setData('/auth/login', props).then((e) => {
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
