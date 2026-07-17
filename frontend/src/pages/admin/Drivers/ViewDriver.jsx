import logger from '../../../utils/logger';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDriverDetails, useRejectDriver, useApproveDriverWages } from '../../../hooks/queries/useDriverQueries';
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ViewDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: viewDriver } = useDriverDetails(id);
  const { mutate: rejectDriver } = useRejectDriver();
  const { mutate: approveDriver } = useApproveDriverWages();

  const onRejectDriver = () => {
    rejectDriver(id);
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleModal = (event) => {
    setModalIsOpen(true);
  };
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
      dailyWage: Yup.string().required('wage is Required'),
      bata: Yup.string().required('bata is Required'),
      shift: Yup.string().required('shift is required'),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      dailyWage: '',
      bata: '',
      shift: '',
    },
    onSubmit: (values, { resetForm }) => {
      // resetForm({ values: '' });

      logger.info('values', values);
      approveDriver({ id, props: values }, { onSuccess: () => navigate('/drivers') });
    },
  });

  return (
    <div class="container rounded bg-white mt-5 mb-5">
      <div class="row">
        <div class="col-md-3 border-right">
          <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              class="rounded-circle mt-5"
              width="150px"
              src={`${process.env.REACT_APP_BACKEND_URL}/${viewDriver?.userPhoto}`}
            />
            <span class="font-weight-bold">{viewDriver?.user?.name}</span>

            <span> </span>
          </div>
        </div>
        <div class="col-md-5 border-right">
          <div class="p-3 py-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="text-right">Driver Details</h4>
            </div>
            <div class="row mt-2">
              <div class="col-md-6">
                <label class="labels">License No</label>
                <input
                  type="text"
                  class="form-control border-0"
                  value={viewDriver?.licenseNo}
                />
              </div>
              {/* <div class="col-md-6">
                <label class="labels">License Type</label>
                <input
                  type="text"
                  class="form-control  border-0"
                  // value={}
                />
              </div> */}
            </div>
            <div class="row mt-3">
              <div class="col-md-12">
                <label class="labels">Mobile Number</label>
                <input
                  type="text"
                  class="form-control  border-0"
                  value={viewDriver?.user?.phoneNumber}
                />
              </div>

              <div class="col-md-12 mt-3">
                <label class="labels">daily wage :</label>

                {viewDriver?.dailyWage === null ? null : (
                  <input
                    type="text"
                    class="form-control  border-0"
                    value={viewDriver?.dailyWage}
                  />
                )}
              </div>
              <div class="col-md-12 mb-3">
                <label class="labels">Bata:</label>
                {viewDriver?.bata === null ? null : (
                  <input
                    type="text"
                    class="form-control  border-0"
                    value={viewDriver?.bata}
                  />
                )}
              </div>
            </div>

            {viewDriver?.status === 'approved' ? (
              <Link className="btn btn-success" to={'/drivers'}>
                back
              </Link>
            ) : viewDriver?.status === 'pending' ? (
              <div>
                <button className="btn btn-success mx-4" onClick={handleModal}>
                  approve
                </button>
                <button className="btn btn-danger" onClick={onRejectDriver}>
                  {' '}
                  reject
                </button>
              </div>
            ) : (
              <Link className="btn btn-success" to={'/drivers'}>
                back
              </Link>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col mt-4">
                <label htmlFor="file-input" className="input-label">
                  enter daily wage
                </label>
                <input
                  type="text"
                  name="dailyWage"
                  id="dailyWage"
                  className="form-control w-25"
                  placeholder="wage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dailyWage}
                />
                {errors.dailyWage && touched.dailyWage ? (
                  <div>{errors.dailyWage}</div>
                ) : null}
              </div>
            </div>
            <div className="row align-items-center mt-4">
              <div className="col">
                <label htmlFor="file-input" className="input-label">
                  bata
                </label>
                <input
                  type="text"
                  id="bata"
                  name="bata"
                  className="form-control w-25"
                  placeholder="bata"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.bata}
                />
                {errors.bata && touched.bata ? <div>{errors.bata}</div> : null}
              </div>
            </div>
            <div className="row align-items-center mt-4">
              <div className="col">
                <label htmlFor="file-input" className="input-label">
                  select shift
                </label>
                <select
                  name="shift"
                  value={values.shift}
                  onChange={handleChange}
                  className="form-control w-25"
                  onBlur={handleBlur}
                  style={{ display: 'block' }}
                >
                  <option value="">Select an shift</option>

                  <option value="morning">morning</option>
                  <option value="night">night</option>
                </select>
                {errors.shift && touched.shift ? (
                  <div>{errors.shift}</div>
                ) : null}
              </div>
            </div>

            <div className="row justify-content-start mt-4">
              <div className="col">
                <button type="submit" className="btn btn-primary mt-4">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ViewDriver;
