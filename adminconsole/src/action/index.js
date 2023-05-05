import Cookies from 'js-cookie';
import { deleteData, getData, postData, updateData } from '../services';

// for toasters

// toaster for success message
export const setSuccessMessage = (data) => (dispatch) => {
  dispatch({
    type: 'SUCCESS_MESSAGE',
    payload: data,
  });
};

// toaster for error message
export const setErrorMessage = (data) => (dispatch) => {
  dispatch({
    type: 'ERROR_MESSAGE',
    payload: data,
  });
};

// reset  success message toaster
export const resetSuccessMessage = () => (dispatch) => {
  dispatch({
    type: 'SUCCESS_MESSAGE',
    payload: null,
  });
};

// reset error message toaster
export const resetErrorMessage = () => (dispatch) => {
  dispatch({
    type: 'ERROR_MESSAGE',
    payload: null,
  });
};

// action for logout
export const setLogout = (navigate) => async (dispatch) => {
  localStorage.removeItem('currentUser');
  Cookies.remove('token');
  dispatch(setSuccessMessage('Logout successfully'));
  navigate();
  // await service.userLogout();
};

//for view profile
export const viewProfile = () => async (dispatch) => {
  const { data } = await getData('/profile/view');
  console.log('data', data);
  if (data.success) {
    dispatch({
      type: 'SET_USER_DATA',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//to fetch feedbacks
export const fetchFeedbacks = (id) => async (dispatch) => {
  const { data } = await getData('/profile/feedback');
  if (data.success) {
    dispatch({
      type: 'SET_USER_FEEDBACKS',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//to fetch feedbacks
export const readFeedback = (id) => async (dispatch) => {
  const { data } = await getData(`/profile/feedback/${id}`);
  console.log('data', data);
  if (data.success) {
    dispatch({
      type: 'SET_USER_FEEDBACK',
      payload: data.data,
    });
    // dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// image upload
export const uploadToGallery = (image, navigate) => async (dispatch) => {
  console.log('imgs', image);
  const { data } = await postData('/gallery', image);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(retrieveImgs());
    navigate();
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// fetch images
export const retrieveImgs = () => async (dispatch) => {
  console.log('first');
  const { data } = await getData('/gallery');
  console.log('data', data);
  dispatch({
    type: 'SET_GALLERY',
    payload: data.data,
  });
};

// image upload
export const dltFromGallery = (id) => async (dispatch) => {
  const { data } = await deleteData(`/gallery/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(retrieveImgs());
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

// dlt upload
export const dltFeedBack = (id) => async (dispatch) => {
  const { data } = await deleteData(`/profile/feedback/${id}`);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
    dispatch(fetchFeedbacks());
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

//change-password
export const changePass = (props) => async (dispatch) => {
  const { data } = await postData('/profile/change-password', props);
  if (data.success) {
    dispatch(setSuccessMessage(data.message));
  } else {
    dispatch(setErrorMessage(data.message));
  }
};

