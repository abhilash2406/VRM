import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllTruckData, getActiveTrucks } from '../TruckManagement/action';
import { getRoutes } from '../RouteManagement/action';
import { getActiveDrivers, getAllDrivers } from '../DriverManagement.js/action';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTrip, getTrip, updateTrip } from './index';
import moment from 'moment';

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
    if (id) {
      dispatch(getTrip(id));
    }
  }, [id]);

  const { tripData } = useSelector((e) => e.routes);
  // console.log('driverData', tripData);

  const { driverData } = useSelector((e) => e.driver);

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
      date: Yup.date().required('  date is Required'),
      truckId: Yup.string().required('select truck'),
      driverId: Yup.string().required('select driver'),
      routeId: Yup.string().required('select route'),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      date: id ? moment(tripData?.date).format('YYYY-MM-DD') : '',
      truckId: id ? tripData?.truckId : '',
      driverId: id ? tripData?.driverId : '',
      routeId: id ? tripData?.routeId : '',
    },
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: '' });
      console.log('values', values);
      if (id) {
        dispatch(updateTrip(id, values, () => navigate('/trips')));
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
                  <div className="form-outline mb-4 w-50">
                    <label htmlFor="date"> Date</label>
                    <br />

                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.date}
                    />
                    {errors.date && touched.date ? (
                      <div>{errors.date}</div>
                    ) : null}
                  </div>
                  <div className="form-outline mb-4">
                    <label htmlFor="photos">select driver</label>
                    <select
                      name="driverId"
                      value={values.driverId}
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: 'block' }}
                    >
                      <option value="">Select an driver</option>
                      {dOptions}
                    </select>
                    {errors.driverId && touched.driverId ? (
                      <div>{errors.driverId}</div>
                    ) : null}
                  </div>

                  <div className="form-outline mb-4">
                    <label htmlFor="photos">select truck</label>

                    <select
                      name="truckId"
                      value={values.truckId}
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: 'block' }}
                    >
                      <option value="">Select an truck</option>
                      {tOptions}
                    </select>
                    {errors.truckId && touched.truckId ? (
                      <div>{errors.truckId}</div>
                    ) : null}
                  </div>

                  <div className="form-outline mb-4">
                    <label htmlFor="photos">select route</label>

                    <select
                      name="routeId"
                      value={values.routeId}
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: 'block' }}
                    >
                      <option value="">Select an route</option>
                      {rOptions}
                    </select>
                    {errors.routeId && touched.routeId ? (
                      <div>{errors.routeId}</div>
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
