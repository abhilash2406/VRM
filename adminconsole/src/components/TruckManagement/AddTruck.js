import React, { useState, useRef, useEffect } from 'react';
import Joi from 'joi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllTruckBrands,
  getAllTruckModels,
  getAllTruckVariants,
  addTrucks,
  getCorrespondingData,
  getTruckDataToEdit,
  UpdateTruck,
} from './action';
import { setErrorMessage } from '../../action';

const schema = Joi.object({});

const AddTruck = () => {
  // console.log(id);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getTruckDataToEdit(id));
    }
  }, [id]);
  const { truckDetails } = useSelector((e) => e.truck);

  useEffect(() => {
    dispatch(getAllTruckBrands());
    // dispatch(getAllTruckModels());
    // dispatch(getAllTruckVariants());
  }, []);

  const { brands } = useSelector((e) => e.truck);
  const { models } = useSelector((e) => e.truck);
  const { variants } = useSelector((e) => e.truck);

  const [branid, setBrandId] = useState('');
  const [modelid, setModelId] = useState('');
  console.log(modelid)

  const getDataFromDb = (e) => {
    const bid = document.getElementById('brand').value;
    setBrandId(bid);
    const mid = document.getElementById('model').value;
    setModelId(mid);
    console.log(bid, mid);
    dispatch(getCorrespondingData({ brandId: bid, modelId: mid }));
  };

  const [truckPhoto, setTruckPhoto] = useState('');
  const [rcPhoto, setRcPhoto] = useState('');

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTruckPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setTruckPhoto(null);
    }
  };
  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRcPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setRcPhoto(null);
    }
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    getFieldProps,
    values,
    setFieldValue,
    errors,
    resetForm,
  } = useFormik({
    validationSchema: Yup.object().shape({
      // brand: Yup.string().required('brand is required'),
      // model: Yup.string().required('model is required'),
      variant: Yup.string().required('variant is required'),
      VIN: Yup.string()
        .matches(
          /^[A-HJ-NPR-Z\d]{8}[X\d][A-HJ-NPR-Z\d]{2}\d{6}$/i,
          'Invalid VIN number'
        )
        .required('VIN number is required'),

      engineNo: Yup.string()
        .matches(/^([a-zA-Z0-9_-]){6,20}$/, 'Invalid engine number')
        .required('Engine number is required'),
      chassisNo: Yup.string()
        .matches(/^[A-HJ-NPR-Z\d]{17}$/i, 'Invalid chassis number')
        .required('Chassis number is required'),

      RCNo: Yup.string()
        .matches(
          /^(([A-Z]{2}\d{2}[A-Z]{2}\d{4})|([A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}))$/i,
          'Invalid RC number'
        )
        .required('RC number is required'),

      yrManufacture: Yup.number()
        .required()
        .min(1950)
        .max(new Date().getFullYear()),
      status: Yup.string().required(),
      condition: Yup.string().required(),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      brand: id ? truckDetails.brand : '',
      model: '',

      variant: id ? truckDetails.variant : '',
      VIN: id ? truckDetails.VIN : '',
      engineNo: id ? truckDetails.engineNo : '',
      chassisNo: id ? truckDetails.chassisNo : '',
      RCNo: id ? truckDetails.RCNo : '',
      yrManufacture: id ? truckDetails.yrManufacture : '',
      status: id ? truckDetails.status : '',
      condition: id ? truckDetails.condition : '',
    },
    onSubmit: (values, { resetForm }) => {
      if (!rcPhoto) {
        dispatch(setErrorMessage('please select rc photo'));
      } else if (!truckPhoto) {
        dispatch(setErrorMessage('please select truck photo'));
      } else {
        const formData = new FormData();
        formData.append('brand', branid);
        formData.append('model', modelid);
        formData.append('variant', values.variant);
        formData.append('VIN', values.VIN);
        formData.append('engineNo', values.engineNo);
        formData.append('chassisNo', values.chassisNo);
        formData.append('RCNo', values.RCNo);
        formData.append('status', values.status);
        formData.append('condition', values.condition);

        formData.append('yrManufacture', values.yrManufacture);
        formData.append('truckPhoto', truckPhoto);
        formData.append('rcPhoto', rcPhoto);
        // resetForm({ values: '' });
        console.log({ ...values });
        if (id) {
          dispatch(UpdateTruck(id, formData, () => navigate('/trucks')));
        } else {
          dispatch(addTrucks(formData, () => navigate('/trucks')));
        }
      }
    },
  });

  return (
    <section className="get-in-touch">
      <h1 className="title">Enter Truck Details</h1>
      <form className="contact-form row" onSubmit={handleSubmit}>
        <div className="form-field col-lg-4 mt-4">
          <label htmlFor="photos">select brand</label>

          <select
            name="brand"
            id="brand"
            className="form-control"
            // value={values.brand}
            onChange={(e) => getDataFromDb(e)}
            onBlur={handleBlur}
            style={{ display: 'block' }}
          >
            <option value="">Select an brand</option>
            {brands?.map((item, index) => (
              <option key={index} value={item.brandId}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.brand && touched.brand ? <div>{errors.brand}</div> : null}
        </div>
        <div className="form-field col-lg-4 mt-4">
          <label htmlFor="photos">select model</label>

          <select
            name="model"
            id="model"
            className="form-control"
            // value={values.model}
            onChange={(e) => getDataFromDb(e)}
            onBlur={handleBlur}
            style={{ display: 'block' }}
          >
            <option value="">Select truck model</option>
            {models?.map((item, index) => (
              <option key={index} value={item.modelId}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.model && touched.model ? <div>{errors.model}</div> : null}
        </div>
        <div className="form-field col-lg-4 mt-4 ">
          <label htmlFor="photos">select variant</label>

          <select
            name="variant"
            id="variant"
            className="form-control"
            value={values.variant}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ display: 'block' }}
          >
            <option value="">Select an variant</option>
            {variants?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.variant && touched.variant ? (
            <div>{errors.variant}</div>
          ) : null}
        </div>
        <div className="form-field col-lg-6 ">
          <label htmlFor="photos"> Vehicle identification number</label>

          <input
            type="text"
            name="VIN"
            className="form-control"
            placeholder="enter VIN"
            id="VIN"
            value={values.VIN}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.VIN && touched.VIN ? <div>{errors.VIN}</div> : null}
        </div>
        <div className="form-field col-lg-6 ">
          <label htmlFor="photos">engine No</label>

          <input
            type="text"
            name="engineNo"
            className="form-control"
            placeholder="enter engineNo"
            id="engineNo"
            value={values.engineNo}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.engineNo && touched.engineNo ? (
            <div>{errors.engineNo}</div>
          ) : null}
        </div>

        <div className="form-field col-lg-6 ">
          <label htmlFor="photos">Chassis No</label>

          <input
            type="text"
            name="chassisNo"
            className="form-control "
            placeholder="enter chassisNo"
            id="chassisNo"
            value={values.chassisNo}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.chassisNo && touched.chassisNo ? (
            <div>{errors.chassisNo}</div>
          ) : null}
        </div>
        <div className="form-field col-lg-6 ">
          <label htmlFor="photos">Rc Number</label>

          <input
            type="text"
            name="RCNo"
            className="form-control input-text js-input"
            placeholder="enter RCNo"
            id="chassisNo"
            value={values.RCNo}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.RCNo && touched.RCNo ? <div>{errors.RCNo}</div> : null}
        </div>

        <div className="col-lg-6">
          <label htmlFor="rcPhoto">RC Photo:</label>
          <input
            type="file"
            name="rcPhoto"
            className="form-control"
            id="rcPhoto"
            onChange={handleImage1Change}
            onBlur={handleBlur}
          />
          {rcPhoto && (
            <img src={rcPhoto} alt="Selected" style={{ maxWidth: '100%' }} />
          )}
          {errors.rcPhoto && touched.rcPhoto ? (
            <div>{errors.rcPhoto}</div>
          ) : null}
        </div>
        <div className="col-lg-6 mt-3">
          <label htmlFor="yrManufacture">Year of Manufacturing:</label>
          <select
            name="yrManufacture"
            id="yrManufacture"
            className="form-control"
            value={values.yrManufacture}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {Array.from({ length: new Date().getFullYear() - 1949 }).map(
              (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              )
            )}
          </select>
          {errors.yrManufacture && touched.yrManufacture ? (
            <div>{errors.yrManufacture}</div>
          ) : null}
        </div>
        <div className="col-lg-6 mt-3">
          <label htmlFor="status">Status:</label>
          <select
            name="status"
            id="status"
            className="form-control"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">select truck status</option>
            <option value="active">active</option>
            <option value="deactive">deactive</option>
            <option value="pending">pending</option>
          </select>
          {errors.status && touched.status ? <div>{errors.status}</div> : null}
        </div>
        <div className="col-lg-6 mt-3">
          <label htmlFor="status">condition:</label>
          <select
            name="condition"
            id="condition"
            className="form-control"
            value={values.condition}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">select truck condition</option>
            <option value="working">working</option>
            <option value="not-working">not-working</option>
          </select>
          {errors.condition && touched.condition ? (
            <div>{errors.condition}</div>
          ) : null}
        </div>
        <div className="col-lg-6 mt-3">
          <label htmlFor="photos">Truck photos:</label>
          <input
            type="file"
            name="truckPhoto"
            className="form-control"
            id="truckPhoto"
            
            multiple
            onChange={handleImage2Change}
            onBlur={handleBlur}
          />
          {truckPhoto && (
            <img src={truckPhoto} alt="Selected" style={{ maxWidth: '100%' }} />
          )}
          {errors.truckPhoto && touched.truckPhoto ? (
            <div>{errors.truckPhoto}</div>
          ) : null}
        </div>

        <div className="form-field col-lg-12">
          <button type="submit" className="btn btn-warning">
            {id ? 'update' : 'add'}
          </button>
          <Link className='btn btn-primary mx-2' to={'/trucks'}>back</Link>
        </div>
      </form>
     
    </section>
  );
};

export default AddTruck;
