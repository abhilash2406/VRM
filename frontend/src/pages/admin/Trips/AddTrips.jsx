import logger from '../../../utils/logger';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useActiveTrucks } from '../../../hooks/queries/useTruckQueries';
import { useAllRoutes } from '../../../hooks/queries/useRouteQueries';
import { useAllDrivers } from '../../../hooks/queries/useDriverQueries';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTripDetails, useAddTrip, useUpdateTrip } from '../../../hooks/queries/useTripQueries';
import moment from 'moment';
const AddTrips = ({ id, onClose }) => {
  const { data: tripData } = useTripDetails(id);
  const { data: driverData } = useAllDrivers();
  const { data: routeData } = useAllRoutes();
  const { data: activeTrucks } = useActiveTrucks();
  const { mutate: addTrip } = useAddTrip();
  const { mutate: updateTrip } = useUpdateTrip();

  const dOptions = driverData?.map((item, index) => (
    <option key={index} value={item.id}>
      {item.user.name}
    </option>
  ));



  const rOptions = routeData?.map((item, index) => (
    <option key={index} value={item.id}>
      {item.from}-{item.to}
    </option>
  ));

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
      logger.info('values', values);
      
      const closeModal = () => {
        resetForm({ values: '' });
        if (onClose) onClose();
        const modal = document.getElementById('addTripModal');
        if (window.bootstrap && modal) {
          const modalInstance = window.bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      };

      if (id) {
        updateTrip({ id, props: values }, { onSuccess: closeModal });
      } else {
        addTrip(values, { onSuccess: closeModal });
      }
    },
  });

  return (
    <div className="modal fade" id="addTripModal" tabIndex="-1" aria-labelledby="addTripModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ background: 'rgba(5, 10, 51, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}>
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title text-light fw-bold">{id ? 'Update Trip' : 'Create New Trip'}</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body p-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary">
              <div className="stat-icon me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem', color: '#00D4FF', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-calendar-event"></i>
              </div>
              <p className="m-0 text-light opacity-75">
                {id ? 'Modify the details of an existing trip.' : 'Schedule a new trip by assigning a driver, truck, and route.'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label text-light small text-uppercase fw-bold">Trip Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control bg-dark text-light border-secondary"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.date}
                    style={{ padding: '12px' }}
                  />
                  {errors.date && touched.date ? (
                    <div className="text-danger small mt-1">{errors.date}</div>
                  ) : null}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-light small text-uppercase fw-bold">Select Driver</label>
                  <select
                    name="driverId"
                    value={values.driverId}
                    className="form-select bg-dark text-light border-secondary"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ padding: '12px' }}
                  >
                    <option value="">Select a driver...</option>
                    {dOptions}
                  </select>
                  {errors.driverId && touched.driverId ? (
                    <div className="text-danger small mt-1">{errors.driverId}</div>
                  ) : null}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-light small text-uppercase fw-bold">Select Truck</label>
                  <select
                    name="truckId"
                    value={values.truckId}
                    className="form-select bg-dark text-light border-secondary"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ padding: '12px' }}
                  >
                    <option value="">Select a truck...</option>
                    {tOptions}
                  </select>
                  {errors.truckId && touched.truckId ? (
                    <div className="text-danger small mt-1">{errors.truckId}</div>
                  ) : null}
                </div>

                <div className="col-md-6">
                  <label className="form-label text-light small text-uppercase fw-bold">Select Route</label>
                  <select
                    name="routeId"
                    value={values.routeId}
                    className="form-select bg-dark text-light border-secondary"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ padding: '12px' }}
                  >
                    <option value="">Select a route...</option>
                    {rOptions}
                  </select>
                  {errors.routeId && touched.routeId ? (
                    <div className="text-danger small mt-1">{errors.routeId}</div>
                  ) : null}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5 border-top border-secondary pt-4">
                <button type="button" className="btn btn-outline-secondary px-4 py-2 text-light" data-bs-dismiss="modal" onClick={onClose} style={{ borderRadius: '12px' }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-info px-5 py-2" 
                  style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }}
                >
                  {id ? 'Update Trip' : 'Create Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTrips;
