import { getData, postData, deleteData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const setRoute = (routeData, navigate) => async (dispatch) => {
  console.log('routeData', routeData);
  const { data } = await postData('/routes/add', routeData);
  if (data.success === true) {
    dispatch(setSuccessMessage('Route created  Successfully'));
    navigate();
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

// dlt route
export const dltRoute = (id) => async (dispatch) => {
  const { data } = await deleteData(`/routes/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(getRoutes());
  } else {
    dispatch(setErrorMessage(data.message));
  }
};


// get route data
export const getRouteData = (id) => async (dispatch) => {
  console.log('hy', id);
  const { data } = await getData(`/routes/${id}`);
  if (data.success) {
    dispatch({
      type: 'GET_ROUTE_DATA',
      payload: data.data,
    });
  } else {
    dispatch(setErrorMessage(data.message));
  }
};