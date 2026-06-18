import { getData } from "../../../services";

export const getAllTransactions = () => async (dispatch) => {
    const { data } = await getData('/transactions');
    dispatch({
      type: 'GET_ALL_TRANSACTIONS',
      payload: data.data,
    });
  };