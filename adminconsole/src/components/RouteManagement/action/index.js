import { getData, postData,deleteData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const setRoute = (routeData) => async (dispatch) => {
  console.log('routeData', routeData);
  const { data } = await postData('/routes/add', routeData);
  if (data.success === true) {
    dispatch(setSuccessMessage('Route created  Successfully'));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

export const getRoutes = () => async (dispatch) => {
  const { data } = await getData('/routes');
  if (data.success) {
    dispatch({
      type: 'GET_ALL_ROUTE',
      payload: data.data,
    });
  }
};

export const dltRoute = (id) => async (dispatch) => {
  const { data } = await deleteData(`/routes/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(getRoutes());
  } else {
    dispatch(setErrorMessage(data.message));
  }
};
