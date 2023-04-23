import React,{useState,useEffect} from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import styledComponents from 'styled-components';

const SELECT = styledComponents(Select)`width: 100%;
padding: 10px;
margin-bottom: 20px;
border: none;
border-radius: 5px;
box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
outline:none
`;
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const signuPSchema = Yup.object().shape({
    // validating username
    first_name: Yup.string().required('first name is Required'),
  
    // validating last name
    last_name: Yup.string().required('last name is Required'),
  
    // validating username
    email: Yup.string()
      .email('type mail in valid format')
      .required('email is Required'),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('phone no is Required'),
  
    // validating password
    password: Yup.string()
      .required('No password provided.')
      .min(4, 'Password is too short - should be 8 chars minimum.')
      .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  });

const FiillDetails = () => {
    const navigate = useNavigate();

    //multi select
    const options = [
      { value: 'two_wheeler', label: 'Two wheeler' },
      { value: 'four_wheeler', label: 'four wheeler' },
      { value: 'heavy_vechile', label: 'heavy vechile' },
    ];
  
    const [selectedOptions, setSelectedOptions] = useState([]);
  
    const handleSelectChange = (selected) => {
      setSelectedOptions(selected);
    };
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
                  phoneNumber: '',
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

                    <div>
                      <SELECT
                        id="multi-select"
                        options={options}
                        value={selectedOptions}
                        onChange={handleSelectChange}
                        isMulti
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="file-input" className="input-label">
                        Upload Licensce
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        className="file-input"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        placeholder="Upload Licensce"
                      />
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button type="submit" className="btn btn-primary">
                        Register
                      </button>
                     
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
  )
}

export default FiillDetails