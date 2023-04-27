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

// delete driver
export const dltDriver = (id) => async (dispatch) => {
    console.log('id', id)
    const { data } = await deleteData(`/drivers/${id}`);
    if (data.success) {
      dispatch(setSuccessMessage(data.message));
      dispatch(getAllDrivers());
    } else {
      dispatch(setErrorMessage(data.message));
    }
  };
  