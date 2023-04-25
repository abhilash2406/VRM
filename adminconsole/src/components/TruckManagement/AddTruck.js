import React, { useState, useRef, useEffect } from 'react';
import Joi from 'joi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllTruckBrands,
  getAllTruckModels,
  getAllTruckVariants,
} from './action';

const schema = Joi.object({});

const AddTruck = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllTruckBrands());
    dispatch(getAllTruckModels());
    dispatch(getAllTruckVariants());
  }, []);

  const { brands } = useSelector((e) => e.truck);
  const { models } = useSelector((e) => e.truck);
  const { variants } = useSelector((e) => e.truck);
  // console.log(brands);
  // console.log(models);
  // console.log(variants);

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
      brand: Yup.string().required('brand is required'),
      model: Yup.string().required('model is required'),
      variant: Yup.string().required('variant is required'),
      VIN: Yup.string().required('vin required'),

      engineNo: Yup.string().required('engine number is required'),
      chassisNo: Yup.string().required('engine number is required'),
      RCNo: Yup.string().required('enter rc no').min(3).max(30),

      yrManufacture: Yup.number()
        .required()
        .min(1950)
        .max(new Date().getFullYear()),
      status: Yup.string().required(),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      brand: '',
      model: '',
      variant: '',
      VIN: '',
      engineNo: '',
      chassisNo: '',
      RCNo: '',

      yrManufacture: '',

      status: '',
    },
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('brand', values.brand);
      formData.append('model', values.model);
      formData.append('variant', values.variant);
      formData.append('VIN', values.VIN);
      formData.append('engineNo', values.engineNo);
      formData.append('chassisNo', values.chassisNo);
      formData.append('RCNo', values.RCNo);
      formData.append('status', values.status);
      formData.append('yrManufacture', values.yrManufacture);

      //   resetForm({ values: '' });
      console.log({ ...values });
      // if (id) {
      // dispatch(updateEvent(id, formData));
      // resetForm();
      // navigate('/events');
      // } else {
      // dispatch(addEvents(formData, () => navigate('/events')));
      // resetForm();
      // navigate('/events');
      // }
    },
  });

  return (
    <section className="get-in-touch">
      <h1 className="title">Enter Truck Details</h1>
      <form className="contact-form row" onSubmit={handleSubmit}>
        <div className="form-field col-lg-6 mt-4">
          <select
            name="brand"
            className="form-control"
            value={values.brand}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ display: 'block' }}
          >
            <option value="">Select an brand</option>
            {brands?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.brand && touched.brand ? <div>{errors.brand}</div> : null}
        </div>
        <div className="form-field col-lg-6 mt-4">
          <select
            name="model"
            className="form-control"
            value={values.model}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ display: 'block' }}
          >
            <option value="">Select truck model</option>
            {models?.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.model && touched.model ? <div>{errors.model}</div> : null}
        </div>
        <div className="form-field col-lg-6 ">
          <select
            name="variant"
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
            // onChange={handleFileChange}
            onBlur={handleBlur}
          />

          {errors.rcPhoto && touched.rcPhoto ? (
            <div>{errors.rcPhoto}</div>
          ) : null}
        </div>
        <div className="col-lg-6">
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
        <div className="col-lg-6">
          <label htmlFor="status">Status:</label>
          <select
            name="status"
            id="status"
            className="form-control"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value=""></option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          {errors.status && touched.status ? <div>{errors.status}</div> : null}
        </div>
        <div className="col-lg-6">
          <label htmlFor="photos">Truck photos:</label>
          <input
            type="file"
            name="truckPhoto"
            className="form-control"
            id="truckPhoto"
            multiple
            // onChange={handleFileChange}
            onBlur={handleBlur}
          />
          {errors.truckPhoto && touched.truckPhoto ? (
            <div>{errors.truckPhoto}</div>
          ) : null}
        </div>

        <div className="form-field col-lg-12">
          <button type="submit" className="btn btn-warning">
            submit
          </button>
        </div>
      </form>
      <Link to={'/trucks'}>back</Link>
    </section>
  );
};

export default AddTruck;
