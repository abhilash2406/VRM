import { getData, postData, deleteData, updateData } from '../../../services';

export const addTrip = (props) => async (dispatch) => {
  console.log('data', props);
  const { data } = await postData('/trips', props);
};

export const getAllTrips = () => async (dispatch) => {
  const { data } = await getData('/trips');
  dispatch({
    type: 'GET_ALL_TRIPS',
    payload: data.data,
  });
};
