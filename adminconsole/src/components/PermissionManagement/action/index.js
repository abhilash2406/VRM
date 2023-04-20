import { getData, postData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

// permissions
export const getPermission = () => async (dispatch) => {
  await getData('/permissions').then((e) => {
    if (e.data.success === true) {
      // console.log(e.data.data);
      dispatch({
        type: 'GET_PERMISSION',
        payload: e.data.data,
      });
    } else {
      dispatch(setErrorMessage(`${e.data.message}`));
    }
  });
};

// give permission
export const givePermission = (id, updateData) => async (dispatch) => {
  // console.log(id, updateData);
  let { data } = await postData(`/permissions/${id}`, updateData);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// get permissions according to role
export const getUserPermission = (id) => async (dispatch) => {
  await getData(`/permissions/permission/${id}`).then((e) => {
    if (e.data.success === true) {
      dispatch({
        type: 'SET_ROLE_DATA',
        payload: e.data.data,
      });
      dispatch(setSuccessMessage(e.data.message));
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

export const setCurrentPermissions = (role, data) => async (dispatch) => {
    console.log(data);
    // if (role === data.role) {
    dispatch({
      type: 'GET_LOGIN',
      permission: data.data,
      payload: role,
    });
    // }
  };
  
  // to fetch user allowed permissions while login
  export const permissionOfLogin = () => async (dispatch) => {
    let { data } = await postData('/profile/permissions');
  
    dispatch({
      type: 'GET_LOGIN',
      permission: data.data.permission,
      payload: data.data.designation,
    });
  };
  