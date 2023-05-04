import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllTruckData, getActiveTrucks } from '../TruckManagement/action';
import { getRoutes } from '../RouteManagement/action';
import { getActiveDrivers, getAllDrivers } from '../DriverManagement.js/action';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTrip, getTrip,updateTrip } from './index';

const AddTrips = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getActiveTrucks());
    dispatch(getAllDrivers());
    dispatch(getRoutes());
  }, []);

  useEffect(() => {
    dispatch(getTrip(id));
  }, [id]);

  const { tripData } = useSelector((e) => e.routes);
 
  const { driverData } = useSelector((e) => e.driver);
  // console.log('driverData', driverData);

  const dOptions = driverData?.map((item, index) => (
    <option key={index} value={item.id}>
      {item.user.name}
    </option>
  ));

  const { routeData } = useSelector((e) => e.routes);

  const rOptions = routeData?.map((item, index) => (
    <option key={index} value={item.id}>
      {item.from}-{item.to}
    </option>
  ));

  const { activeTrucks } = useSelector((e) => e.truck);

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
      truck: id ? tripData?.truckId : '',
      driver: id ? tripData?.driverId : '',
      route: id ? tripData?.routeId : '',
    },
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: '' });

      
      if (id) {
        dispatch(updateTrip(id,values, () => navigate('/trips')));

      } else {
        dispatch(addTrip(values, () => navigate('/trips')));
        //   }
      }
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
                  <label htmlFor="photos">select driver</label>
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
                  <label htmlFor="photos">select truck</label>

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
                  <label htmlFor="photos">select route</label>

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

                  <button type="submit" className="btn btn-success  mb-1">
                    {id ? 'update' : 'submit'}
                  </button>
                  <Link to={'/trips'} className="btn btn-dark mx-2">
                  back
                </Link>
                </form>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTrips;
