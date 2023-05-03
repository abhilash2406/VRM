import React, { useState, useEffect, useRef } from 'react';
import styledComponents from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { useFormik, Formik } from 'formik';
import * as Yup from 'yup';
import { addDrivers } from './action';
import { setErrorMessage } from '../../action';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const AddDrivers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //multi select

  const [licenseImg, setLicenseImg] = useState('');
  const [userImg, setUserImg] = useState('');

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    setLicenseImg(file);
  };
  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    setUserImg(file);
  };

  const validationSchema1 = Yup.object().shape({
    name: Yup.string().min(3).max(20).required('name is Required'),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('phone no is Required'),
    email: Yup.string()
      .email('type mail in valid format')
      .required('email is Required'),
    licenseType: Yup.string().required('License is required'),

    licenseNo: Yup.string().required('License number is required'),
    shift: Yup.string().required('shift is required'),
    dailyWage: Yup.string().required('dailyWage is required'),
    bata: Yup.string().required('bata is required'),
  });

  const fileInputRef = useRef(null);

  return (
    <div className="row d-flex justify-content-center">
      <div className=" text-left">
        <h3> Driver infos</h3>

        <div className="card ">
          <Formik
            initialValues={{
              // initial values
              name: '',
              phoneNumber: '',
              email: '',
              licenseType: '',
              licenseNo: '',
              shift: '',
              dailyWage: '',
              bata: '',
            }}
            // validation
            validationSchema={validationSchema1}
            // on submit values
            onSubmit={(values, { resetForm }) => {
              if (!licenseImg) {
                dispatch(setErrorMessage('please select license photo'));
              } else if (!userImg) {
                dispatch(setErrorMessage('please select user photo'));
              } else {
                console.log('values', values);
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('phoneNumber', values.phoneNumber);
                formData.append('email', values.email);
                formData.append('licenseType', values.licenseType);
                formData.append('licenseNo', values.licenseNo);
                formData.append('shift', values.shift);
                formData.append('dailyWage', values.dailyWage);
                formData.append('licensePhoto', licenseImg);
                formData.append('userPhoto', userImg);
                formData.append('bata', values.bata);

                resetForm({ values: '' });
                document.getElementById('userPhoto').value = null;
                document.getElementById('licensePhoto').value = null;

                dispatch(addDrivers(formData, () => navigate('/drivers')));
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row">
                  <div className="form-group mb-4 w-50 mx-3">
                    <div className="form-group mb-4 w-75">
                      <label htmlFor="license" style={{ fontWeight: '700' }}>
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        placeholder="Enter Your license_no"
                      />

                      {errors.name && touched.name ? (
                        <div>{errors.name}</div>
                      ) : null}
                    </div>

                    <div className="form-group mb-4 w-75">
                      <label htmlFor="license" style={{ fontWeight: '700' }}>
                        email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        placeholder="Enter Your license_no"
                      />

                      {errors.email && touched.email ? (
                        <div>{errors.email}</div>
                      ) : null}
                    </div>

                    <div className="form-group mb-4 w-75">
                      <label htmlFor="uname" style={{ fontWeight: '700' }}>
                        Driver Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="userPhoto"
                        name="userPhoto"
                        onChange={handleImage1Change}
                        onBlur={handleBlur}
                      />

                      {errors.userPhoto && touched.userPhoto ? (
                        <div>{errors.userPhoto}</div>
                      ) : null}
                    </div>
                    <div className="w-75">
                      <label style={{ fontWeight: '700' }}>owned license</label>
                      <select
                        name="licenseType"
                        value={values.licenseType}
                        onChange={handleChange}
                        className="form-control"
                        onBlur={handleBlur}
                        style={{ display: 'block' }}
                      >
                        <option value="">Select your license</option>

                        <option value="two_wheeler">Two wheeler</option>
                        <option value="four_wheeler">Four wheeler</option>

                        <option value="heavy_vehicle">Heavy Vehicle</option>
                      </select>
                      {errors.licenseType && touched.licenseType ? (
                        <div>{errors.licenseType}</div>
                      ) : null}
                    </div>
                    <div className="form-group mb-4 w-75">
                      <label htmlFor="license" style={{ fontWeight: '700' }}>
                        license No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="licenseNo"
                        name="licenseNo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.licenseNo}
                        placeholder="Enter Your license_no"
                      />

                      {errors.licenseNo && touched.licenseNo ? (
                        <div>{errors.licenseNo}</div>
                      ) : null}
                    </div>
                    <div className="form-group mb-4 w-75">
                      <label htmlFor="file-input" className="input-label">
                        Upload license
                      </label>
                      <input
                        type="file"
                        id="licensePhoto"
                        className="form-control"
                        name="licensePhoto"
                        onChange={handleImage2Change}
                        onBlur={handleBlur}
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        placeholder="Upload license"
                      />
                    </div>
                    <div className="form-group mb-4 w-75">
                      <select
                        name="shift"
                        value={values.shift}
                        onChange={handleChange}
                        className="form-control"
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
                    <div className="form-group mb-4 w-75">
                      <label htmlFor="first_name" style={{ fontWeight: '700' }}>
                        Enter dailyWage
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="dailyWage"
                        name="dailyWage"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.dailyWage}
                        placeholder="Enter Your dailyWage"
                      />

                      {errors.dailyWage && touched.dailyWage ? (
                        <div>{errors.dailyWage}</div>
                      ) : null}
                    </div>
                    <div className="form-group mb-4 w-75">
                      <label htmlFor="first_name" style={{ fontWeight: '700' }}>
                        Enter bata
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="bata"
                        name="bata"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.bata}
                        placeholder="Enter Your bata"
                      />

                      {errors.bata && touched.bata ? (
                        <div>{errors.bata}</div>
                      ) : null}
                    </div>

                    <div className="row ">
                      <div className="form-group col-sm-6">
                        {' '}
                        <button type="submit" className="btn btn-dark">
                          Register
                        </button>{' '}
                        <Link to={'/drivers'} className="btn btn-warning">
                          back
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-4 mx-3 w-50">
                    <div className="form-group mb-4 w-75">
                      <label htmlFor="license" style={{ fontWeight: '700' }}>
                        phone number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        name="phoneNumber"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phoneNumber}
                        placeholder="Enter Your license_no"
                      />

                      {errors.phoneNumber && touched.phoneNumber ? (
                        <div>{errors.phoneNumber}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddDrivers;
