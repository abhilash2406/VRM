import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSubmitContact } from '../../hooks/queries/useContactQueries';
import { Link } from 'react-router-dom';
import '../../style/ContactUs.css';

const ContactUs = () => {
  const { mutateAsync: submitContact } = useSubmitContact();
  return (
    <div className="contact-page-container">
      <div className="contact-glass-card">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Please fill out the form below.</p>
        </div>
        <Formik
          initialValues={{ name: '', phone_number: '', email: '', message: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            phone_number: Yup.string().required('Phone number is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            message: Yup.string().required('Message is required'),
          })}
          onSubmit={async (values, { resetForm }) => {
            console.log('input values', values);
            try {
              await submitContact(values);
              resetForm();
            } catch (err) {
              // error handled by mutation
            }
          }}
        >
          <Form>
            <div className="contact-form-group">
              <label htmlFor="name">Name</label>
              <Field 
                name="name" 
                type="text" 
                className="contact-input" 
                placeholder="Enter your name" 
              />
              <ErrorMessage name="name" component="span" className="contact-error" />
            </div>

            <div className="contact-form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <Field
                name="phone_number"
                type="text"
                className="contact-input"
                placeholder="Enter your phone number"
              />
              <ErrorMessage name="phone_number" component="span" className="contact-error" />
            </div>

            <div className="contact-form-group">
              <label htmlFor="email">Email</label>
              <Field
                name="email"
                type="email"
                className="contact-input"
                placeholder="Enter your email address"
              />
              <ErrorMessage name="email" component="span" className="contact-error" />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">Message</label>
              <Field
                name="message"
                as="textarea"
                className="contact-input"
                placeholder="How can we help you?"
              />
              <ErrorMessage name="message" component="span" className="contact-error" />
            </div>

            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>
            <Link to="/" className="contact-back-link">
              ← Back to Home
            </Link>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ContactUs;
