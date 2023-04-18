import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { setLogin } from '../../action';
import { useDispatch, useSelector } from 'react-redux';
import Loaders from '../Loaders';
import GoogleLogin from 'react-google-login';
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

  // const responseGoogle = async (res) => {
  //   const bodyObject = {
  //     Name: res.profileObj.name,
  //     email: res.profileObj.email,
  //     token: res.googleId,
  //     Image: res.profileObj.imageUrl,
  //     ProviderId: 'Google'
  //   };
  //   console.log('bodyObject', bodyObject);
  //   try {
  //     if (isEmpty(res.errors)) {
  //       setLoginStatus(true);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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
                  console.log('values', values);
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
                        {/* <GoogleLogin
                          clientId="260034014064-lkl520uidbjl3a7p2f8cl1fc8mi8d1fr.apps.googleusercontent.com"
                          render={(renderProps) => (
                            <button
                              className="btn g-sigin"
                              onClick={renderProps.onClick}
                              disabled={renderProps.disabled}
                            >
                              <p>Continue with Google</p>
                            </button>
                          )}
                          buttonText="Login"
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle}
                          cookiePolicy={'single_host_origin'}
                        /> */}
                      </div>

                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Don't have an account?{' '}
                        <Link to="/signup">Register</Link>
                      </p>
                    </div>
                  </form>
                )}
              </Formik>
              <a href="http://localhost:3000">back</a>
            </div>
            <div className="col-sm-6 hide-on-mobile">
              <div id="demo" className="carousel slide" data-ride="carousel">
                <ul className="carousel-indicators">
                  <li
                    data-target="#demo"
                    data-slide-to="0"
                    className="active"
                  ></li>
                  <li data-target="#demo" data-slide-to="1"></li>
                </ul>

                <a
                  className="carousel-control-prev"
                  href="#demo"
                  data-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
