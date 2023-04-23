import Cookies from 'js-cookie';
import { getData, postData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

//for login

export const setLogin = (props, navigate) => async (dispatch) => {
  console.log('props', props);
  await postData('/auth/login', props).then((e) => {
    console.log('e.data', e.data);
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
      // dispatch({
      //   type: 'GET_LOGIN',
      //   payload: e.data.data.designation,
      //   permission: e.data.data.permission,
      // });
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
      // dispatch({
      //   type: 'GET_LOGIN',
      //   payload: e.data.data.designation,
      //   permission: e.data.data.permission,
      // });
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

// signup
export const setSignuP = (props, navigate) => async (dispatch) => {
  await postData('/auth/signUp', props).then((e) => {
    if (e.data.success) {
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
      navigate();
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

