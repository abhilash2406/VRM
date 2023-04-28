// login page

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { setLogin, setGLogin } from './action';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Loaders from '../Loaders';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from '@react-oauth/google';

import { isEmpty } from 'lodash';

const LoginSchema = Yup.object().shape({
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

const Login = () => {
  // const [isLoggedIn, setLoginStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setLoading } = useSelector((state) => state.auth);

  async function verifyGoogleAccessToken(access_token) {
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${access_token}`;
    const response = await axios.get(url);
    const data = response;
    console.log(data);
    dispatch(
      setGLogin({ token: access_token, data: data }, () =>
        navigate('/dashboard')
      )
    );
  }

  return setLoading ? (
    <Loaders />
  ) : (
    <section className="body">
      <div className="container">
        <div className="login-box">
          <div className="row">
            <div className="col-sm-6">
              <div className="logo">
                <span className="logo-font">Go</span>Login
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <br />

              <Formik
                initialValues={{
                  // initial values
                  email: '',
                  password: '',
                }}
                // validation
                validationSchema={LoginSchema}
                // on submit values
                onSubmit={(values, { resetForm }) => {
                  resetForm({ values: '' });
                
                  dispatch(setLogin(values, () => navigate('/dashboard')));
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
                        id="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        placeholder="Enter Your Email"
                      />

                      {errors.email && touched.email ? (
                        <div>{errors.email}</div>
                      ) : null}
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="pass" style={{ fontWeight: '700' }}>
                        password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        placeholder="Enter Your passWord"
                      />

                      {errors.password && touched.password ? (
                        <div>{errors.password}</div>
                      ) : null}
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button type="submit" className="btn btn-primary">
                        Login
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

                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Don't have an account?{' '}
                        <Link to="/signup">Register</Link>
                      </p>
                    </div>
                  </form>
                )}
              </Formik>
              <a href="http://localhost:3000" className='btn btn-info'>back</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
