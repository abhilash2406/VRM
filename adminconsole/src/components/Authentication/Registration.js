import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MultiSelect from './MultiSelect';
import Select from 'react-select';
import styledComponents from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from '@react-oauth/google';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setSignuP, setGsignUp } from './action';

const signuPSchema = Yup.object().shape({
  // validating username
  email: Yup.string()
    .email('type mail in valid format')
    .required('email is Required'),
});

const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function verifyGoogleAccessToken(access_token) {
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${access_token}`;
    const response = await axios.get(url);
    const data = response;
    console.log(data);
    dispatch(
      setGsignUp({ token: access_token, data: data }, () =>
        navigate('/fill-details')
      )
    );
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
                  email: '',
                }}
                // validation
                validationSchema={signuPSchema}
                // on submit values
                onSubmit={(values, { resetForm }) => {
                  resetForm({ values: '' });
                  console.log('values', values);
                  dispatch(setSignuP(values, () => navigate('/fill-details')));
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
                        placeholder="Enter Your your email"
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
              <Link to={'/login'} className='btn btn-info'>back</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
