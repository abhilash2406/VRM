import logger from '../../utils/logger.js';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSignup } from '../../hooks/queries/useAuthQueries';
import styled, { keyframes } from 'styled-components';

/* ── Animations ── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ── Styled Components ── */
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url('/hero3.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(8px);
    z-index: 0;
  }
`;

const GlassCard = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
  border-radius: 24px;
  padding: 48px 40px;
  animation: ${fadeIn} 0.6s ease-out;
  text-align: center;
`;

const BrandTitle = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 8px;
  color: #ffffff;
  
  span {
    background: linear-gradient(90deg, #00D4FF, #0066FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const SubTitle = styled.p`
  color: #cbd5e1;
  font-size: 0.95rem;
  margin-bottom: 32px;
`;

const FormGroup = styled.div`
  text-align: left;
  margin-bottom: 24px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    border-color: #00D4FF;
    box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 6px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #00D4FF, #0066FF);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.5);
    background: linear-gradient(135deg, #0066FF, #00D4FF);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const FooterText = styled.p`
  margin-top: 24px;
  color: #94a3b8;
  font-size: 0.9rem;
  
  a {
    color: #00D4FF;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: #ffffff;
    }
  }
`;

const FlexRow = styled.div`
  display: flex;
  gap: 16px;
  
  > div {
    flex: 1;
  }
`;

/* ── Component Logic ── */
const signuPSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, 'Too short')
    .max(30, 'Too long')
    .required('First name is required'),
  last_name: Yup.string()
    .min(1, 'Too short')
    .max(30, 'Too long')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, 'Must contain uppercase, lowercase, number, and special character')
    .required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  phone_number: Yup.string()
    .required('Phone number is required'),
});

const Registration = () => {
  const navigate = useNavigate();
  const { mutateAsync: signup } = useSignup();

  return (
    <PageContainer>
      <GlassCard>
        <BrandTitle>
          DriveOn<span>Ryd</span>
        </BrandTitle>
        <SubTitle>Create an account to get started.</SubTitle>

        <Formik
          initialValues={{ first_name: '', last_name: '', email: '', password: '', confirm_password: '', phone_number: '' }}
          validationSchema={signuPSchema}
          onSubmit={async (values, { resetForm }) => {
            const { confirm_password, ...apiPayload } = values;
            logger.info('apiPayload', apiPayload);
            try {
              await signup(apiPayload);
              resetForm();
              navigate('/fill-details');
            } catch (err) {
              // error handled by mutation
            }
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
          }) => (
            <form onSubmit={handleSubmit}>
              <FlexRow>
                <FormGroup>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="John"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                  />
                  {errors.first_name && touched.first_name && <ErrorText>{errors.first_name}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_name}
                  />
                  {errors.last_name && touched.last_name && <ErrorText>{errors.last_name}</ErrorText>}
                </FormGroup>
              </FlexRow>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && touched.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  placeholder="e.g. +1234567890"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone_number}
                />
                {errors.phone_number && touched.phone_number && <ErrorText>{errors.phone_number}</ErrorText>}
              </FormGroup>

              <FlexRow>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {errors.password && touched.password && <ErrorText>{errors.password}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Confirm your password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirm_password}
                  />
                  {errors.confirm_password && touched.confirm_password && <ErrorText>{errors.confirm_password}</ErrorText>}
                </FormGroup>
              </FlexRow>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </SubmitButton>

              <FooterText>
                Already have an account? <Link to="/login">Login Here</Link>
              </FooterText>
              
              <FooterText style={{ marginTop: '12px' }}>
                <Link to="/">← Back to Home</Link>
              </FooterText>
            </form>
          )}
        </Formik>
      </GlassCard>
    </PageContainer>
  );
};

export default Registration;
