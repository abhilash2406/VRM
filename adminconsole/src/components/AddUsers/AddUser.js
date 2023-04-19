// add user by admin

import React, { useRef } from 'react';
import { addUser } from './action';
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

  //   useEffect(() => {
  //     if (id) {
  //       dispatch(getAdminDataToEdit(id));
  //       setIsReadOnly(true);
  //     }
  //   }, [id]);

  //   const { adminData } = useSelector((state) => state.admin);

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
      Name: Yup.string().min(3).max(20).required('name is Required'),
      phone_number: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('phone no is Required'),
      email: Yup.string()
        .email('type mail in valid format')
        .required('email is Required'),
    }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      Name: '',
      phone_number: '',
      email: '',
    },
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: '' });
      const formData = new FormData();
      formData.append('Name', values.Name);
      formData.append('phone_number', values.phone_number);
      formData.append('email', values.email);

      if (id) {
        // formData.append(
        //   'image',
        //   fileInputRef.current.files[0] || adminData.image
        // );
        // dispatch(updateAdminData(id, formData));
        // navigate('/admin');
      } else {
        formData.append('image', fileInputRef.current.files[0]);
        console.log('values', values);
        dispatch(addUser(formData, () => navigate('/admin')));
      }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <section>
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-8 col-xl-6">
                  <div class="row">
                    <div class="col text-center title">
                      <h1>Wethaq KYC Form</h1>
                    </div>
                  </div>
                  <div class="row align-items-center">
                    <div class="col mt-4">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div class="row align-items-center mt-4">
                    <div class="col">
                      <input
                        type="email"
                        class="form-control"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div class="row align-items-center mt-4">
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                  <div class="row align-items-center mt-4">
                    <div class="col">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Postal Address"
                      />
                    </div>
                  </div>
                  <div class="row align-items-center mt-4">
                    <div class="col">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Password"
                      />
                    </div>
                    <div class="col">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  <div class="row justify-content-start mt-4">
                    <div class="col">
                      <div class="form-check">
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input" />I
                          hereby agree to abide by the{' '}
                          <a href="/">Terms and Conditions.</a>
                        </label>
                      </div>

                      <button class="btn btn-primary mt-4">Submit</button>
                    </div>
                  </div>
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
