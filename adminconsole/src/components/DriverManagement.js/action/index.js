import { getData, postData, deleteData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const getAllDrivers = () => async (dispatch) => {
  const { data } = await getData('/drivers');
  console.log('data', data);
  dispatch({
    type: 'GET_DRIVER_DATA',
    payload: data.data,
  });
};

export const addDrivers = (props, navigate) => async (dispatch) => {
  const { data } = await postData('/drivers', props);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    navigate('/drivers');
  } else {
    dispatch(setErrorMessage(data.message));
  }
};
