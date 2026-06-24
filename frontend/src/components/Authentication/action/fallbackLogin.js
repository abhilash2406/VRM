import Cookies from 'js-cookie';
import { setSuccessMessage } from '../../../action';

export const isHardcodedAdmin = (email, password) => {
  const admin1Email = process.env.REACT_APP_FALLBACK_ADMIN1_EMAIL;
  const admin1Pass = process.env.REACT_APP_FALLBACK_ADMIN1_PASSWORD;
  const admin2Email = process.env.REACT_APP_FALLBACK_ADMIN2_EMAIL;
  const admin2Pass = process.env.REACT_APP_FALLBACK_ADMIN2_PASSWORD;

  return (
    (email === admin1Email && password === admin1Pass) ||
    (email === admin2Email && password === admin2Pass)
  );
};

export const performFallbackLogin = (navigate, dispatch) => {
  Cookies.set('token', 'fallback-admin-token');
  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      token: 'fallback-admin-token',
      designation: 'SUPERADMIN',
    })
  );
  navigate();
  dispatch(setSuccessMessage('Login successful (Admin Fallback)'));
  dispatch({
    type: 'GET_LOGIN',
    payload: 'SUPERADMIN',
    permission: [],
  });
};
