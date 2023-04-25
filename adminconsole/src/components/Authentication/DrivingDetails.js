import React, { useState, useEffect, useRef } from 'react';
import styledComponents from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getUserData } from './action';

const SELECT = styledComponents(Select)`width: 100%;
padding: 10px;
margin-bottom: 20px;
border: none;
border-radius: 5px;
box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
outline:none
`;
const DrivingDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState(1);

  const { driverData } = useSelector((e) => e.auth);
  console.log('driverData', driverData);
  //multi select
  const options = [
    { value: 'two_wheeler', label: 'Two wheeler' },
    { value: 'four_wheeler', label: 'four wheeler' },
    { value: 'heavy_vehicle', label: 'heavy vehicle' },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  console.log('error', error);
  console.log('selectedOptions', selectedOptions);
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
    setError('');
  };

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
      licenseNo: Yup.string().required('License number is required'),

      shift: Yup.string().required('shift is required'),
      dailyWage: Yup.string().required('dailyWage is required'),
      bata: Yup.string().required('bata is required'),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      licenseType: '',

      licenseNo: '',
      shift: '',
      dailyWage: '',
      bata: '',
    },
    onSubmit: async (values, { resetForm }) => {
      if (selectedOptions.length === 0) {
        setError('Please select an option');
        alert('Please select at least one value.');
      } else {
        const formData = new FormData();

        formData.append('licenseType', selectedOptions);

        formData.append('licenseNo', values.licenseNo);
        formData.append('first_name', driverData.first_name);
        formData.append('last_name', driverData.last_name);
        formData.append('email', driverData.email);
        formData.append('phoneNumber', driverData.phoneNumber);
        formData.append('password', driverData.password);
        formData.append('bata', values.bata);
        formData.append('shift', values.shift);
        formData.append('dailyWage', values.dailyWage);
        formData.append('licensePhoto', licenseImg);
        formData.append('userPhoto', userImg);

        // resetForm({ values: '' });
        console.log({ ...values });

        dispatch(getUserData(formData, () => navigate('/dashboard')));
      }
    },
  });

  const fileInputRef = useRef(null);

  return (
    <div className="row d-flex justify-content-center">
      <div className=" text-left">
        <h3> Driver details</h3>

        <div className="card bg-black">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-row">
              <div className="form-group mb-4 w-50 mx-3">
                <div className="form-group mb-4 w-75">
                  <label htmlFor="uname" style={{ fontWeight: '700' }}>
                    image
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
                  <SELECT
                    id="multi-select"
                    options={options}
                    value={selectedOptions}
                    onChange={handleSelectChange}
                    isMulti
                  />
                  {error && <div className="error">{error}</div>}
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
                  </div>
                </div>
              </div>
              <div className="form-group mb-4 mx-3"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DrivingDetails;
