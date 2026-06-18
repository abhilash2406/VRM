import logger from '../../../utils/logger';
import Cookies from 'js-cookie';
import { getData, postData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

//for login

export const setLogin = (props, navigate) => async (dispatch) => {
  logger.info('props', props);
  await postData('/auth/login', props).then((e) => {
    logger.info('e.data', e.data);
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
      logger.info(e.data.data.permission);
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

// login using google

export const setGLogin = (props, navigate) => async (dispatch) => {
  await postData('/auth/GLogin', props).then((e) => {
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
      logger.info(e.data.data.permission);
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

// signup
export const setSignuP = (props, navigate) => async (dispatch) => {
  await postData('/auth/signUp', props).then((e) => {
    if (e.data.success) {
      dispatch({
        type: 'SET_USERMAIL',
        payload: e.data.data,
      });
      navigate();
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

//google sign up
export const setGsignUp = (props, navigate) => async (dispatch) => {
  await postData('/auth/GsignUp', props).then((e) => {
    if (e.data.success) {
      dispatch({
        type: 'SET_USERMAIL',
        payload: e.data.data,
      });
      navigate();
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

// fetch sign up user data
export const getUserData = (props, navigate) => async (dispatch) => {
  logger.info('props', props);
  await postData('/auth/userdata', props).then((e) => {
    logger.info('data', e.data);
    if (e.data.success) {
      const jsonString = JSON.stringify(e.data.data);
      Cookies.set('myCookie', jsonString);
      dispatch({
        type: 'SET_USERDATA',
        payload: e.data.data,
      });
      window.location.href = e.data.url;
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

export const getDriverData = (props, navigate) => (dispatch) => {
  dispatch({
    type: 'SET_DRIVER_DETAILS',
    payload: props,
  });
  navigate();
};

// make payment using stripe
export const makePayment = (userData,navigate) => async (dispatch) => {
  logger.info('userData', userData);
  const { data } = await postData('/auth/payment', userData);
  if (data.success) {
    logger.info(data.data);
    navigate();

    window.location.href = data.next_action.use_stripe_sdk.stripe_js;
  } else {
    dispatch(setErrorMessage(data.message));
  }
};
