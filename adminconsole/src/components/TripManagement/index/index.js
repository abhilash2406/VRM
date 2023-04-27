import { getData, postData, deleteData, updateData } from '../../../services';

export const addTrip = (props) => async (dispatch)=>{
    console.log('data', data)
    const {data} = await postData('/trips',props)
    
}