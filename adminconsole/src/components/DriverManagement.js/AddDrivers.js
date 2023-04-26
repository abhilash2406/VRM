import React, { useState, useEffect, useRef } from 'react';
import styledComponents from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { useFormik, Formik } from 'formik';
import * as Yup from 'yup';

import { getCorrespondingData,getAllTruckBrands } from '../TruckManagement/action';

const SELECT = styledComponents(Select)`width: 100%;
padding: 10px;
margin-bottom: 20px;
border: none;
border-radius: 5px;
box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
outline:none
`;
const AddDrivers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState(1);

 
  //multi select
  const options = [
    { value: 'two_wheeler', label: 'Two wheeler' },
    { value: 'four_wheeler', label: 'four wheeler' },
    { value: 'heavy_vehicle', label: 'heavy vehicle' },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

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

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const handleCheckbox1Change = (event) => {
    setIsChecked1(event.target.checked);
    setIsChecked2(!event.target.checked);
  };

  const handleCheckbox2Change = (event) => {
    setIsChecked2(event.target.checked);
    setIsChecked1(!event.target.checked);
  };

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

  const handleImage3Change = (e) => {
    const file = e.target.files[0];
    setTruckPhoto(file);
  };
  const handleImage4Change = (e) => {
    const file = e.target.files[0];
    setRcPhoto(file);
  };

  const validationSchema1 = Yup.object().shape({
    licenseNo: Yup.string().required('License number is required'),
    shift: Yup.string().required('shift is required'),
    dailyWage: Yup.string().required('dailyWage is required'),
    bata: Yup.string().required('bata is required'),
  });

  const validationSchema2 = Yup.object().shape({
    licenseNo: Yup.string().required('License number is required'),
    shift: Yup.string().required('shift is required'),
    dailyWage: Yup.string().required('dailyWage is required'),
    bata: Yup.string().required('bata is required'),
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
  });

  const fileInputRef = useRef(null);

  return (
    <div className="row d-flex justify-content-center">
      <div className=" text-left">
        <h3> Driver details</h3>

        <div className="card ">
          <Formik
            initialValues={{
              // initial values
              licenseType: '',
              licenseNo: '',
              shift: '',
              dailyWage: '',
              bata: '',
              brand: '',
              model: '',
              variant: '',
              VIN: '',
              engineNo: '',
              chassisNo: '',
              RCNo: '',
              yrManufacture: '',
              status: '',
            }}
            // validation
            validationSchema={
              isChecked1 === true ? validationSchema2 : validationSchema1
            }
            // on submit values
            onSubmit={(values, { resetForm }) => {
              console.log('values', values);
              const formData = new FormData();
              if (isChecked1 === true) {
                formData.append('licenseType', selectedOptions);
                formData.append('licenseNo', values.licenseNo);
                formData.append('shift', values.shift);
                formData.append('dailyWage', values.dailyWage);
                formData.append('licensePhoto', licenseImg);
                formData.append('userPhoto', userImg);
                formData.append('bata', values.bata);
                formData.append('brand', branid);
                formData.append('model', modelid);
                formData.append('variant', values.variant);
                formData.append('VIN', values.VIN);
                formData.append('engineNo', values.engineNo);
                formData.append('chassisNo', values.chassisNo);
                formData.append('RCNo', values.RCNo);
                formData.append('status', values.status);
                formData.append('yrManufacture', values.yrManufacture);
                formData.append('truckPhoto', truckPhoto);
                formData.append('rcPhoto', rcPhoto);
              } else {
                formData.append('licenseType', selectedOptions);
                formData.append('licenseNo', values.licenseNo);
                formData.append('shift', values.shift);
                formData.append('dailyWage', values.dailyWage);
                formData.append('licensePhoto', licenseImg);
                formData.append('userPhoto', userImg);
                formData.append('bata', values.bata);
              }
              // resetForm({ values: '' });
              // dispatch(getUserData(values, () => navigate('/success')));
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

                    <div>
                      <label>Do you have truck?</label>
                      <input
                        type="checkbox"
                        checked={isChecked1}
                        onChange={handleCheckbox1Change}
                      />
                      <label>yes</label>

                      <input
                        type="checkbox"
                        checked={isChecked2}
                        onChange={handleCheckbox2Change}
                      />
                      <label>No</label>
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

                  <div className="form-group mb-4 mx-3 w-50">
                    {isChecked1 ? (
                      <div className="mt-3">
                        <div className="form-group mb-4 w-75">
                          <label htmlFor="brand">brand:</label>

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
                        </div>
                        <div className="form-group mb-4 w-75">
                          <label htmlFor="model">model:</label>

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
                        </div>

                        <div className="form-group mb-4 w-75">
                          <label htmlFor="variant">Variant:</label>

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

                        <div className="form-group mb-4 w-75">
                          <label htmlFor="VIN">VI No:</label>

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

                          {errors.VIN && touched.VIN ? (
                            <div>{errors.VIN}</div>
                          ) : null}
                        </div>

                        <div className="form-group mb-4 w-75">
                          <label htmlFor="engineNo">engine No:</label>

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

                        <div className="form-group mb-4 w-75">
                          <label htmlFor="chassisNo">chassis No:</label>

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

                        <div className="form-group mb-4 w-75">
                          <label htmlFor="RCNo">Rc No:</label>

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
                          {errors.RCNo && touched.RCNo ? (
                            <div>{errors.RCNo}</div>
                          ) : null}
                        </div>

                        <div className="form-group mb-4 w-75">
                          <label htmlFor="rcPhoto">RC Photo:</label>
                          <input
                            type="file"
                            name="rcPhoto"
                            className="form-control"
                            id="rcPhoto"
                            onChange={handleImage3Change}
                            onBlur={handleBlur}
                          />

                          {errors.rcPhoto && touched.rcPhoto ? (
                            <div>{errors.rcPhoto}</div>
                          ) : null}
                        </div>

                        <div className="form-group mb-4 w-75">
                          <label htmlFor="yrManufacture">
                            Year of Manufacturing:
                          </label>
                          <select
                            name="yrManufacture"
                            id="yrManufacture"
                            className="form-control"
                            value={values.yrManufacture}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {Array.from({
                              length: new Date().getFullYear() - 1949,
                            }).map((_, i) => (
                              <option
                                key={i}
                                value={new Date().getFullYear() - i}
                              >
                                {new Date().getFullYear() - i}
                              </option>
                            ))}
                          </select>
                          {errors.yrManufacture && touched.yrManufacture ? (
                            <div>{errors.yrManufacture}</div>
                          ) : null}
                        </div>

                        <div className="form-group mb-4 w-75">
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
                          {errors.status && touched.status ? (
                            <div>{errors.status}</div>
                          ) : null}
                        </div>
                        <div className="form-group mb-4 w-75">
                          <label htmlFor="photos">Truck photos:</label>
                          <input
                            type="file"
                            name="truckPhoto"
                            className="form-control"
                            id="truckPhoto"
                            multiple
                            onChange={handleImage4Change}
                            onBlur={handleBlur}
                          />
                          {errors.truckPhoto && touched.truckPhoto ? (
                            <div>{errors.truckPhoto}</div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
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
