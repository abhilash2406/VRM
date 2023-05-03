import { getData, postData, deleteData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const addTrip = (props) => async (dispatch) => {
  console.log('data', props);
  const { data } = await postData('/trips', props);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

export const getAllTrips = () => async (dispatch) => {
  const { data } = await getData('/trips');
  dispatch({
    type: 'GET_ALL_TRIPS',
    payload: data.data,
  });
};


export const dltTrip = (id) => async (dispatch) => {
  const { data } = await deleteData(`/trips/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(getAllTrips());
  } else {
    dispatch(setErrorMessage(data.message));
  }
};
