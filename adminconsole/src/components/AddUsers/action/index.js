import { getData, postData, updateData } from '../../../services';
import { setSuccessMessage, setErrorMessage } from '../../../action';

export const addUser = (data, navigate) => async (dispatch) => {
  console.log(data);
  await postData('/admin/add-user', data).then((e) => {
    if (e.data.success) {
      dispatch(setSuccessMessage(e.data.message));
      navigate();
    } else {
      dispatch(setErrorMessage(e.data.message));
    }
  });
};
