import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from '@react-oauth/google';
import { Formik } from 'formik';
import * as Yup from 'yup';

const signuPSchema = Yup.object().shape({
  // validating username
  first_name: Yup.string().required('first name is Required'),

  // validating last name
  last_name: Yup.string().required('last name is Required'),

  // validating username
  email: Yup.string()
    .email('type mail in valid format')
    .required('username is Required'),

  // validating password
  password: Yup.string()
    .required('No password provided.')
    .min(4, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
});

const Registration = () => {
  const navigate = useNavigate();

  async function verifyGoogleAccessToken(access_token) {
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${access_token}`;
    const response = await axios.get(url);
    const data = response;
    console.log(data);
    // dispatch(
    //   setGLogin({ token: access_token, data: data }, () =>
    //     navigate('/dashboard')
    //   )
    // );
  }
  return (
    <section className="body">
      <div className="container">
        <div className="login-box">
          <div className="row">
            <div className="col-sm-6">
              <div className="logo">
                <span className="logo-font">Go</span>Signup
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <br />

              <Formik
                initialValues={{
                  // initial values
                  first_name: '',
                  last_name: '',
                  email: '',
                }}
                // validation
                validationSchema={signuPSchema}
                // on submit values
                onSubmit={(values, { resetForm }) => {
                  resetForm({ values: '' });
                  console.log('values', values);
                  // dispatch(setLogin(values, () => navigate('/dashboard')));
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
                    <div className="form-group mb-4">
                      <label htmlFor="uname" style={{ fontWeight: '700' }}>
                        Enter Your E-mail
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.first_name}
                        placeholder="Enter Your first_name"
                      />

                      {errors.first_name && touched.first_name ? (
                        <div>{errors.first_name}</div>
                      ) : null}
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="pass" style={{ fontWeight: '700' }}>
                        password
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.last_name}
                        placeholder="Enter Your last_name"
                      />

                      {errors.last_name && touched.last_name ? (
                        <div>{errors.last_name}</div>
                      ) : null}
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="pass" style={{ fontWeight: '700' }}>
                        email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        placeholder="Enter Your email"
                      />

                      {errors.email && touched.email ? (
                        <div>{errors.email}</div>
                      ) : null}
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button type="submit" className="btn btn-primary">
                        Register
                      </button>
                      <div>
                        <GoogleOAuthProvider clientId="260034014064-t9k3lhrlke6ocfvt1d69r6nddktpqk34.apps.googleusercontent.com">
                          <GoogleLogin
                            onSuccess={(credentialResponse) => {
                              verifyGoogleAccessToken(
                                credentialResponse.credential
                              );
                            }}
                            onError={() => {
                              console.log('Login Failed');
                            }}
                            // useOneTap
                          />
                        </GoogleOAuthProvider>
                      </div>

                
                    </div>
                  </form>
                )}
              </Formik>
              <a href="http://localhost:3000">back</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
