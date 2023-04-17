import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ContactUs = () => {
  return (
    <div>
      
      <Formik
        initialValues={{ name: '', phonenumber: '', email: '', message: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          phonenumber: Yup.number().required('Required'),
          email: Yup.string().required('Email is Required'),
          message: Yup.string().required('Message Required'),
        })}
        onSubmit={(values) => {
          console.log('input values', values);
        }}
      >
        <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '80%',
            margin: '2% 0% 0% 25%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              margin: '10px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
              padding: '20px',
            }}
          >
            <h1>Contact Us</h1>

            <label htmlFor="name">
              <b>Name</b>
            </label>
            <Field name="name" type="text" />
            <span className="text-danger">
              <ErrorMessage name="name" />
            </span>
            <label htmlFor="phonenumber">
              <b>Phone Number</b>
            </label>
            <Field
              name="phonenumber"
              type="number"
              style={{ margin: '0% 0% 2% 0%' }}
            />
            <span className="text-danger">
              <ErrorMessage name="phonenumber" />
            </span>
            <label htmlFor="email">
              <b>Email</b>
            </label>
            <Field
              name="email"
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
              as="textarea"
              style={{ margin: '0% 0% 2% 0%' }}
            />
            <span className="text-danger">
              <ErrorMessage name="message" />
            </span>
            <button type="submit" className="btn btn-dark">
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ContactUs;
