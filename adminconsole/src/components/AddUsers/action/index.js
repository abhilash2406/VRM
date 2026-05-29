import logger from '../../../utils/logger';
import { getData, postData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const addUser = (data, navigate) => async (dispatch) => {
  logger.info(data);
  await postData('/auth/add-user', data).then((e) => {
    if (e.data.success) {
      dispatch(setSuccessMessage(e.data.message));
      // navigate();
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};

export const fetchDesignations = () => async (dispatch) => {
  const { data } = await getData('/designations');
  dispatch({
    type: 'SET_DESIGNATIONS',
    payload: data.data,
  });
};
