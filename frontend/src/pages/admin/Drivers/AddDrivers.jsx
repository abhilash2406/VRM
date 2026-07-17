import logger from '../../../utils/logger';
import React, { useState, useEffect, useRef } from 'react';
import styledComponents from 'styled-components';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAddDriver, useDriverDetails, useUpdateDriver } from '../../../hooks/queries/useDriverQueries';
import { useMsgStore } from '../../../store/useMsgStore';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const AddDrivers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  logger.info(id);

  //multi select
  const options = [
    { value: 'two-wheeler', label: 'two-wheeler' },
    { value: 'four-wheeler', label: 'four-wheeler' },
    { value: 'heavy-vehicle', label: 'heavy-vehicle' },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const [licenseImg, setLicenseImg] = useState('');
  const [userImg, setUserImg] = useState('');
   const [isReadOnly, setIsReadOnly] = useState(false);

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    setLicenseImg(file);
  };
  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    setUserImg(file);
  };

  useEffect(() => {
    if (id) {
      setIsReadOnly(true);
    }
  }, [id]);

  const { data: viewDriver } = useDriverDetails(id);
  const { mutate: addDriver } = useAddDriver();
  const { mutate: updateDriver } = useUpdateDriver();
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  const validationSchema1 = Yup.object().shape({
    name: Yup.string().min(3).max(20).required('name is Required'),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('phone no is Required'),
    email: Yup.string()
      .email('type mail in valid format')
      .required('email is Required'),

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
              name: id ? viewDriver?.user?.name : '',
              phoneNumber: id ? viewDriver?.user?.phoneNumber : '',
              email: id ? viewDriver?.user?.login?.email : '',

              licenseNo: id ? viewDriver?.licenseNo : '',
              shift: id ? viewDriver?.shift : '',
              dailyWage: id ? viewDriver?.dailyWage : '',
              bata: id ? viewDriver?.bata : '',
            }}
            enableReinitialize={true}
            // validation
            validationSchema={validationSchema1}
            // on submit values
            onSubmit={(values, { resetForm }) => {
              if (!licenseImg) {
                setErrorMessage('please select license photo');
              } else if (!userImg) {
                setErrorMessage('please select user photo');
              } else if (selectedOptions.length === 0) {
                setErrorMessage('please select your license');
              } else {
                logger.info('values', values);
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('phoneNumber', values.phoneNumber);
                formData.append('email', values.email);
                formData.append('licenseType', selectedOptions);
                formData.append('licenseNo', values.licenseNo);
                formData.append('shift', values.shift);
                formData.append('dailyWage', values.dailyWage);
                formData.append('licensePhoto', licenseImg);
                formData.append('userPhoto', userImg);
                formData.append('bata', values.bata);

                resetForm({ values: '' });
                // document.getElementById('userPhoto').value = null;
                // document.getElementById('licensePhoto').value = null;
                // setLicenseImg('');
                // setUserImg('')
                if (id) {
                  updateDriver({ id, props: formData }, { onSuccess: () => navigate('/drivers') });
                } else {
                  addDriver(formData, { onSuccess: () => navigate('/drivers') });
                }
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
                         readOnly={isReadOnly}
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

                    <div className="w-75 mb-4">
                      <label style={{ fontWeight: '700' }}>owned license</label>
                      <Select
                        id="multi-select"
                        options={options}
                        className="form-control"
                        value={selectedOptions}
                        onChange={handleSelectChange}
                        isMulti
                      />
                      {errors.licenseType && touched.licenseType ? (
                        <div>{errors.licenseType}</div>
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
                      <label htmlFor="license" style={{ fontWeight: '700' }}>
                        select shift
                      </label>
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
