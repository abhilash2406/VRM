import React, { useState, useEffect } from 'react';
import styledComponents from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

const DrivingDetails = () => {
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
    // validationSchema: Yup.object().shape({
    //   name: Yup.string().min(3).max(20).required('venue name is Required'),

    //   pin: Yup.string().required('pin is Required'),
    //   city: Yup.string().required('city is Required'),
    //   state: Yup.string().required('state is Required'),
    //   country: Yup.string().required('country is Required'),
    //   contact_number: Yup.string()
    //     .matches(phoneRegExp, 'Phone number is not valid')
    //     .required('phone no is Required'),
    //   contact_name: Yup.string()
    //     .min(3)
    //     .max(20)
    //     .required('contact name is Required'),
    // }),
    enableReinitialize: true,
    // initial values
    initialValues: {
      name: '',
      city: '',
      state: '',
      country: '',
      pin: '',
      contact_number: '',
      contact_name: '',
    },
    onSubmit: async (values, { resetForm }) => {
      await Geocode.fromAddress(values.city).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);
          values.latitude = lat;
          values.longitude = lng;
        },
        (error) => {
          alert(error);
          console.error(error);
        }
      );

      const formData = new FormData();
      formData.append('name', inputValues.name);
      formData.append('city', inputValues.city);
      formData.append('state', inputValues.state);
      formData.append('country', inputValues.country);
      formData.append('pin', inputValues.pin);
      formData.append('latitude', inputValues.latitude);
      formData.append('longitude', inputValues.longitude);
      formData.append('contact_number', inputValues.contact_number);
      formData.append('contact_name', inputValues.contact_name);
      formData.append('image', fileInputRef.current.files[0]);
      resetForm({ values: '' });

      if (id) {
        // dispatch(updateVenue(id, formData));
        // resetForm();
        // navigate('/venues');
      } else {
        dispatch(addVenues(formData));
        // resetForm();
        navigate('/venues');
      }
    },
  });

  const fileInputRef = useRef(null);

  return (
    <div className="row d-flex justify-content-center">
      <div className="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
        <h3>{id ? 'EDIT' : 'ADD'} VENUE</h3>

        <div className="card">
          <h5 className="text-center mb-4">
            Powering world-class Venues for events
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="row justify-content-between text-left">
              <div className="form-group mb-4 w-50">
                <label htmlFor="uname" style={{ fontWeight: '700' }}>
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      name: e.target.value,
                    })
                  }
                  value={inputValues.name}
                  placeholder="Enter venue name"
                />

                {errors.name && touched.name ? <div>{errors.name}</div> : null}
              </div>
              <div className="form-group w-25 mb-4">
                <GoogleMap position={position} />
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
              <div className="row align-items-center mt-4">
                <input
                  type="radio"
                  id="one"
                  name="group"
                  value="One"
                  onChange={(e) => e.target.value}
                  required
                />
                <label htmlFor="one">One</label>
                <br />

                <input
                  type="radio"
                  id="two"
                  name="group"
                  value="Two"
                  onChange={(e) => e.target.value}
                />
                <label htmlFor="two">Two</label>
              </div>
              <div className="form-group w-50 mb-4">
                <label htmlFor="uname" style={{ fontWeight: '700' }}>
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      City: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                  value={inputValues.city}
                />

                {errors.city && touched.city ? <div>{errors.city}</div> : null}
              </div>
            </div>
            <div className="row justify-content-between text-left">
              <div className="form-group mb-4 w-50">
                <label htmlFor="uname" style={{ fontWeight: '700' }}>
                  State
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  name="state"
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      state: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                  value={inputValues.state}
                  placeholder="Enter Your state"
                />

                {errors.state && touched.state ? (
                  <div>{errors.state}</div>
                ) : null}
              </div>
              <div className="form-group w-50 mb-4">
                <label htmlFor="uname" style={{ fontWeight: '700' }}>
                  country
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      country: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                  value={inputValues.country}
                />

                {errors.country && touched.country ? (
                  <div>{errors.country}</div>
                ) : null}
              </div>
            </div>
            <div className="row justify-content-between text-left">
              <div className="form-group w-50 mb-4">
                <label htmlFor="uname" style={{ fontWeight: '700' }}>
                  Pin code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pin"
                  name="pin"
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      pin: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                  value={inputValues.pin}
                />

                {errors.pin && touched.pin ? <div>{errors.pin}</div> : null}
              </div>
              <div className="form-group w-50 mb-4">
                <label htmlFor="uname" style={{ fontWeight: '700' }}>
                  contact_no
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contact_number"
                  name="contact_number"
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      contact_number: e.target.value,
                    })
                  }
                  value={inputValues.contact_number}
                />

                {errors.contact_number && touched.contact_number ? (
                  <div>{errors.contact_number}</div>
                ) : null}
              </div>
            </div>

            <div className="form-group w-50 mb-4">
              <label htmlFor="uname" style={{ fontWeight: '700' }}>
                contact Name
              </label>
              <input
                type="text"
                className="form-control"
                id="contact_name"
                name="contact_name"
                onChange={(e) =>
                  setInputValues({
                    ...inputValues,
                    contact_name: e.target.value,
                  })
                }
                value={inputValues.contact_name}
              />

              {errors.contact_name && touched.contact_name ? (
                <div>{errors.contact_name}</div>
              ) : null}
            </div>
            <div className="row justify-content-between text-left">
              <div className="form-group w-50 mb-4">
                <label htmlFor="uname" style={{ fontWeight: '700' }}>
                  image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.image && touched.image ? (
                  <div>{errors.image}</div>
                ) : null}
              </div>
            </div>

            <div className="row justify-content-end">
              <div className="form-group col-sm-6">
                {' '}
                <button type="submit" className="btn btn-dark">
                  Add
                </button>{' '}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DrivingDetails;
