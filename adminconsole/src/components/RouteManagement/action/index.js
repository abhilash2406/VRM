import { getData, postData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const setRoute = (routeData) => async (dispatch) => {
  console.log('routeData', routeData);
  let { data } = await postData('/routes/add', routeData);
  if (data.success === true) {
    dispatch(setSuccessMessage('Route created  Successfully'));
  } else {
    dispatch(setErrorMessage(data.message));
  }

  
};
