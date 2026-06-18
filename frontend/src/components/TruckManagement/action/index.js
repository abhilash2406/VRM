import logger from '../../../utils/logger';
import { getData, postData, updateData, deleteData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

//get all truck brands
export const getAllTruckBrands = () => async (dispatch) => {
  const { data } = await getData('/trucks/brands');
  dispatch({
    type: 'GET_TRUCK_BRANDS',
    payload: data.data,
  });
};

//get all truck models
export const getAllTruckModels = () => async (dispatch) => {
  const { data } = await getData('/trucks/models');
  dispatch({
    type: 'GET_TRUCK_MODELS',
    payload: data.data,
  });
};

//get all truck variants
export const getAllTruckVariants = () => async (dispatch) => {
  const { data } = await getData('/trucks/variants');
  dispatch({
    type: 'GET_TRUCK_VARIANTS',
    payload: data.data,
  });
};

//add truck
export const addTrucks = (props, navigate) => async (dispatch) => {
  logger.info(props);
  const { data } = await postData('trucks/add', props);
  if (data.success) {
    dispatch(setSuccessMessage(data.success));
    navigate();
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

export const getCorrespondingData = (dat) => async (dispatch) => {
  const { data } = await postData('/trucks/get-data', dat);
  logger.info('data', data);
  // dispatch({
  //   type: 'GET_TRUCK_BRANDS',
  //   payload: data.brand,
  // });
  dispatch({
    type: 'GET_TRUCK_MODELS',
    payload: data.model,
  });
  dispatch({
    type: 'GET_TRUCK_VARIANTS',
    payload: data.variant,
  });
};

// get all truck data
export const getAllTruckData = () => async (dispatch) => {
  const { data } = await getData('/trucks');
  if (data.success) {
    dispatch({
      type: 'GET_ALL_TRUCKS',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// get all truck data
export const getTruckDataToEdit = (id) => async (dispatch) => {
  const { data } = await getData(`trucks/${id}`);
  if (data.success) {
    dispatch({
      type: 'GET_SELECTED_TRUCKDATA',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// dlt upload
export const dltTruck = (id) => async (dispatch) => {
  const { data } = await deleteData(`/trucks/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(getAllTruckData());
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// get active truck data
export const getActiveTrucks = () => async (dispatch) => {
  const { data } = await getData('/trucks/activeTrucks');
  if (data.success) {
    dispatch({
      type: 'GET_ACTIVE_TRUCKS',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//update truck
export const UpdateTruck = (id, props, navigate) => async (dispatch) => {
  logger.info(props,id)
  const { data } = await updateData(`/trucks/${id}`, props);
  if (data.success) {
    dispatch(setSuccessMessage(data.success));
    navigate();
  } else {
    dispatch(setErrorMessage(data.message));
  }
};
