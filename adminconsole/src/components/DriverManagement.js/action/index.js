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

// get active drivers
export const getActiveDrivers = () => async (dispatch) => {
  const { data } = await getData(`/drivers/present`);
  console.log('data', data);
};

// add driver
export const addDrivers = (props, navigate) => async (dispatch) => {
  const { data } = await postData('/drivers', props);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    navigate();
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

// reject driver
export const rejectDriver = (id) => async (dispatch) => {
  console.log(id);
  const { data } = await updateData(`/drivers/reject/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(getDriverData(id));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//approve driver
export const setDrvWages = (props, navigate) => async (dispatch) => {
  const { data } = await updateData(`/drivers/approve`, props);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    navigate();
  } else {
    dispatch(setErrorMessage(data.message));
  }
};


//delete drivers

export const dltDriver = (id) => async (dispatch) => {
  const { data } = await deleteData(`/drivers/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(getAllDrivers());
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//update driver
export const updateDrivers = (id, props, navigate) => async (dispatch) => {
  const { data } = await updateData(`/drivers/${id}`, props);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    navigate();
  } else {
    dispatch(setErrorMessage(data.message));
  }
};