import Cookies from 'js-cookie';
import { postData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const setLogin = (props, navigate) => async (dispatch) => {
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
