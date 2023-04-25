import { getData, postData, updateData } from '../../../services';
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
