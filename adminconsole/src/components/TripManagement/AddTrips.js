import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTruckData, getActiveTrucks } from '../TruckManagement/action';
import { getRoutes } from '../RouteManagement/action';
import { getActiveDrivers,getAllDrivers } from '../DriverManagement.js/action';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTrip } from './index';

const AddTrips = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getActiveTrucks());
    dispatch(getAllDrivers());
    dispatch(getRoutes());
  }, []);
  const { driverData } = useSelector((e) => e.driver);
  console.log('driverData', driverData);

  const dOptions = driverData?.map((item, index) => (
    <option key={index} value={item.id}>
      {item.user.name}
    </option>
  ));

  const { routeData } = useSelector((e) => e.routes);
  console.log(routeData);
  const rOptions = routeData?.map((item, index) => (
    <option key={index} value={item.id}>
      {item.from}-{item.to}
    </option>
  ));

  const { activeTrucks } = useSelector((e) => e.truck);
  console.log(activeTrucks);
  const tOptions = activeTrucks?.map((item, index) => (
    <option key={index} value={item.id}>
      {item.brand}-{item.model}-{item.variant}
    </option>
  ));

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    resetForm,
  } = useFormik({
    validationSchema: Yup.object().shape({
      truck: Yup.string().required('select truck'),
      driver: Yup.string().required('select driver'),
      route: Yup.string().required('select route'),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      truck: '',
      driver: '',
      route: '',
    },
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: '' });

      
      console.log('values', values);
      dispatch(addTrip(values, () => navigate('/trips')));
      //   }
    },
  });

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: '#8fc4b7' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-8 col-xl-6">
            <div className="card rounded-3">
              <img
                src="https://s3-ap-northeast-1.amazonaws.com/wp-gogovan.com/wp-content/uploads/sites/5/2021/03/26094714/IN_vehicle_type_1280x760.jpg"
                className="w-100"
                alt="Sample photo"
              />
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Trip</h3>

                <form className="px-md-2" onSubmit={handleSubmit}>
                  <div className="form-outline mb-4">
                    <select
                      name="driver"
                      value={values.driver}
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: 'block' }}
                    >
                      <option value="">Select an driver</option>
                      {dOptions}
                    </select>
                    {errors.driver && touched.driver ? (
                      <div>{errors.driver}</div>
                    ) : null}
                  </div>

                  <div className="form-outline mb-4">
                    <select
                      name="truck"
                      value={values.truck}
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: 'block' }}
                    >
                      <option value="">Select an truck</option>
                      {tOptions}
                    </select>
                    {errors.truck && touched.truck ? (
                      <div>{errors.truck}</div>
                    ) : null}
                  </div>

                  <div className="form-outline mb-4">
                    <select
                      name="route"
                      value={values.route}
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: 'block' }}
                    >
                      <option value="">Select an route</option>
                      {rOptions}
                    </select>
                    {errors.route && touched.route ? (
                      <div>{errors.route}</div>
                    ) : null}
                  </div>

                  <button type="submit" className="btn btn-success btn-lg mb-1">
                    Submit
                  </button>
                </form>
                <Link to={'/trips'} className='btn btn-dark'>back</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTrips;
