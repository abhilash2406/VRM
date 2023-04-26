// add user by admin

import React, { useRef, useEffect } from 'react';
import { addUser, fetchDesignations } from './action';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import NavBar from '../Main/NavBar';
import { Link, useParams, useNavigate } from 'react-router-dom';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const AddUser = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const fileInputRef = useRef(null);

  // const [isReadOnly, setIsReadOnly] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchDesignations());
  // },[]);

  useEffect(() => {
    dispatch(fetchDesignations());
  }, []);

  const { designations } = useSelector((state) => state.user);
  console.log('designations', designations);

  // const userRole = JSON.parse(localStorage.getItem('currentUser')).designation;

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
      name: Yup.string().min(3).max(20).required('name is Required'),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('phone no is Required'),
      email: Yup.string()
        .email('type mail in valid format')
        .required('email is Required'),
      designation: Yup.string().required('designation is Required'),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      name: '',
      phoneNumber: '',
      email: '',
      designation: '',
    },
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: '' });
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('email', values.email);
      formData.append('designation', values.designation);

      if (id) {
        // formData.append(
        //   'image',
        //   fileInputRef.current.files[0] || adminData.image
        // );
        // dispatch(updateAdminData(id, formData));
        // navigate('/admin');
      } else {
        // formData.append('image', fileInputRef.current.files[0]);
        // console.log('values', values);
        dispatch(addUser(values, () => navigate('/admin')));
      }
    },
  });

  const options = designations.filter(
    (item) => item.designation !== 'Admin' && item.designation !== 'Driver'
  );
  console.log('options', options);

  const dOptions = options
    ?.map((item, index) => (
      <option key={index} value={item.id}>
        {item.designation}
      </option>
    ))
    .filter((item) => item.designation !== 'Admin');

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <section>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-8 col-xl-6">
                  <div className="row">
                    <div className="col text-center title">
                      <h1>Add user</h1>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row align-items-center">
                      <div className="col mt-4">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control"
                          placeholder="Full Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        />
                        {errors.name && touched.name ? (
                          <div>{errors.name}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="row align-items-center mt-4">
                      <div className="col">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                        {errors.email && touched.email ? (
                          <div>{errors.email}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="row align-items-center mt-4">
                      <div className="col">
                        <input
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          className="form-control"
                          placeholder="phone number"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.phoneNumber}
                        />
                        {errors.phoneNumber && touched.phoneNumber ? (
                          <div>{errors.phoneNumber}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="row align-items-center mt-4">
                      <div className="col">
                        <select
                          name="designation"
                          value={values.designation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ display: 'block' }}
                        >
                          <option value="">Select an designation</option>
                          {dOptions}
                        </select>
                        {errors.designation && touched.designation ? (
                          <div>{errors.designation}</div>
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
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
