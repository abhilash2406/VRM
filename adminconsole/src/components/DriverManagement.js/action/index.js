import { getData, postData, deleteData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

// get all drivers
export const getAllDrivers = () => async (dispatch) => {
  const { data } = await getData('/drivers');
  console.log('data', data);
  dispatch({
    type: 'GET_DRIVER_DATA',
    payload: data.data,
  });
};

// add driver
export const addDrivers = (props, navigate) => async (dispatch) => {
  const { data } = await postData('/drivers', props);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    navigate('/drivers');
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// get driver data
export const getDriverData = (id) => async (dispatch) => {
  console.log('hy', id);
  const { data } = await getData(`/drivers/${id}`);
  if (data.success) {
    dispatch({
      type: 'SET_DRIVER_DATA',
      payload: data.data,
    });
  } else {
    dispatch(setErrorMessage(data.message));
  }
};
