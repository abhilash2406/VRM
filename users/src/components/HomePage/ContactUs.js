import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { contactDetails } from '../../action';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const ContactUs = () => {
  const dispatch = useDispatch();
  return (
    <div className="w-75">
      <Formik
        initialValues={{ name: '', phoneNumber: '', email: '', message: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required(' Name Required'),
          phoneNumber: Yup.string().required(' ph no is Required'),
          email: Yup.string().required('Email is Required'),
          message: Yup.string().required('Message Required'),
        })}
        onSubmit={(values, { resetForm }) => {
          console.log('input values', values);
          dispatch(contactDetails(values));
          resetForm();
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: '10px',
            
            padding: '20px',
          }}
        >
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '80%',
              // margin: '2% 0% 0% 25%',
            }}
          >
            <h1>Submit your feedback</h1>

            <label htmlFor="name">
              <b>Name</b>
            </label>
            <Field name="name" type="text" className="form-control" />
            <span className="text-danger">
              <ErrorMessage name="name" />
            </span>
            <label htmlFor="phoneNumber">
              <b>Phone Number</b>
            </label>
            <Field
              name="phoneNumber"
              className="form-control"
              type="string"
              style={{ margin: '0% 0% 2% 0%' }}
            />
            <span className="text-danger">
              <ErrorMessage name="phoneNumber" />
            </span>
            <label htmlFor="email">
              <b>Email</b>
            </label>
            <Field
              name="email"
              className="form-control"
              type="email"
              style={{ margin: '0% 0% 2% 0%' }}
            />
            <span className="text-danger">
              <ErrorMessage name="email" />
            </span>
            <label htmlFor="message">
              <b>Message</b>
            </label>
            <Field
              name="message"
              className="form-control"
              as="textarea"
              style={{ margin: '0% 0% 2% 0%' }}
            />
            <span className="text-danger">
              <ErrorMessage name="message" />
            </span>
            <button type="submit" className="btn btn-dark">
              Submit
            </button>
            <Link to="/" >back</Link>
          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default ContactUs;
