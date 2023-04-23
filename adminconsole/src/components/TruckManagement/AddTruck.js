import React, { useState } from 'react';
import Joi from 'joi';
import { Link } from 'react-router-dom';

const schema = Joi.object({
  brand: Joi.string().required().min(2).max(30).label('brand'),
  model: Joi.string().required().min(2).max(30).label('model'),
  variant: Joi.string().required().min(2).max(30).label('variant'),
  VIN: Joi.string()
    .required()
    .regex(/[A-HJ-NPR-Z0-9]{17}/)
    .label('VIN'),
  engineNo: Joi.string().required().min(3).max(30).label('engineNo'),
  chassisNo: Joi.string().required().min(3).max(30).label('chassisNo'),
  RCNo: Joi.string()
    .required()
    .min(3)
    .max(30)
    .regex(/^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/)
    .label('RCNo'),
  rcPhoto: Joi.string().required().label('rcPhoto'),
  yrManufacture: Joi.number()
    .required()
    .min(1950)
    .max(new Date().getFullYear())
    .label('Year of Manufacturing'),
    truckPhoto: Joi.array().items(Joi.string()).min(1).required().label('photos'),
  status: Joi.string().required().label('status'),
});

const AddTruck = () => {
  const [formState, setFormState] = useState({
    brand: '',
    model: '',
    variant: '',
    VIN: '',
    engineNo: '',
    chassisNo: '',
    RCNo: '',
    rcPhoto: '',
    yrManufacture: '',
    truckPhoto: [],
    status: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldSchema = schema.extract(name);
    const { error } = fieldSchema.validate(value);
    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error.message,
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };
  console.log(errors);

  const handleFileChange = (e) => {
    const { files } = e.target;
    const fileNames = Array.from(files).map((file) => file.name);
    setFormState((prevState) => ({ ...prevState, photos: fileNames }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = schema.validate(formState, { abortEarly: false });
    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.context.label] = detail.message;
      });
      setErrors(validationErrors);
    } else {
      // submit the form
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-8 col-xl-6">
          <form onSubmit={handleSubmit}>
            <div className="col mt-4">
              <label htmlFor="brand">Brand:</label>
              <input
                type="text"
                name="brand"
                id="brand"
                value={formState.brand}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.brand && <p>{errors.brand}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="model">Model:</label>
              <input
                type="text"
                name="model"
                id="model"
                value={formState.model}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.model && <p>{errors.model}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="variant">Variant:</label>
              <input
                type="text"
                name="variant"
                id="variant"
                value={formState.variant}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.variant && <p>{errors.variant}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="VIN">VIN:</label>
              <input
                type="text"
                name="VIN"
                id="VIN"
                value={formState.vin}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.VIN && <p>{errors.VIN}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="engineNo">Engine No:</label>
              <input
                type="text"
                name="engineNo"
                id="engineNo"
                value={formState.engineNo}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.engineNo && <p>{errors.engineNo}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="chassisNo">Chassis No:</label>
              <input
                type="text"
                name="chassisNo"
                id="chassisNo"
                value={formState.chassisNo}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.chassisNo && <p>{errors.chassisNo}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="RCNo">RC No:</label>
              <input
                type="text"
                name="RCNo"
                id="RCNo"
                value={formState.RCNo}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.RCNo && <p>{errors.RCNo}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="rcPhoto">RC Photo:</label>
              <input
                type="file"
                name="rcPhoto"
                id="rcPhoto"
                onChange={handleFileChange}
                onBlur={handleBlur}
              />
              {errors.rcPhoto && <p>{errors.rcPhoto}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="yrManufacture">
                Year of Manufacturing:
              </label>
              <select
                name="yrManufacture"
                id="yrManufacture"
                value={formState.yrManufacture}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {Array.from({ length: new Date().getFullYear() - 1949 }).map(
                  (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  )
                )}
              </select>
              {errors['Year of Manufacturing'] && (
                <p>{errors['Year of Manufacturing']}</p>
              )}
            </div>
            <div className="col mt-4">
              <label htmlFor="photos">Photos:</label>
              <input
                type="file"
                name="truckPhoto"
                id="truckPhoto"
                multiple
                onChange={handleFileChange}
                onBlur={handleBlur}
              />
              {errors.truckPhoto && <p>{errors.truckPhoto}</p>}
            </div>
            <div className="col mt-4">
              <label htmlFor="status">Status:</label>
              <select
                name="status"
                id="status"
                value={formState.status}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value=""></option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {errors.status && <p>{errors.status}</p>}
            </div>
            <button type="submit" className='btn btn-info'>Submit</button>
          </form>
          <Link to={'/trucks'}>back</Link>
        </div>
      </div>
    </div>
  );
};

export default AddTruck;
