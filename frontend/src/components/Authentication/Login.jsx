import logger from '../../utils/logger';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLogin, useGoogleLogin } from '../../hooks/queries/useAuthQueries';
import { useAuthStore } from '../../store/useAuthStore';
import Loaders from '../Loaders';
import {
  GoogleOAuthProvider,
  GoogleLogin,
} from '@react-oauth/google';
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

const LoginButton = styled.button`
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #64748b;
  font-size: 0.85rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &::before {
    margin-right: .5em;
  }

  &::after {
    margin-left: .5em;
  }
`;

const GoogleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
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

/* ── Component Logic ── */
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(4, 'Password must be at least 4 characters')
});

const Login = () => {
  const navigate = useNavigate();
  const { setLoading } = useAuthStore();
  const { mutateAsync: login } = useLogin();
  const { mutateAsync: googleLogin } = useGoogleLogin();

  async function verifyGoogleAccessToken(access_token) {
    await googleLogin({ token: access_token });
    navigate('/dashboard');
  }

  if (setLoading) {
    return <Loaders />;
  }

  return (
    <PageContainer>
      <GlassCard>
        <BrandTitle>
          DriveOn<span>Ryd</span>
        </BrandTitle>
        <SubTitle>Welcome back. Please login to continue.</SubTitle>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await login(values);
              resetForm();
              navigate('/dashboard');
            } catch (err) {
              // error is handled by mutation
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
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password && <ErrorText>{errors.password}</ErrorText>}
              </FormGroup>

              <LoginButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </LoginButton>

              <Divider>OR</Divider>

              <GoogleWrapper>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      verifyGoogleAccessToken(credentialResponse.credential);
                    }}
                    onError={() => {
                      logger.info('Login Failed');
                    }}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                  />
                </GoogleOAuthProvider>
              </GoogleWrapper>

              <FooterText>
                Don't have an account? <Link to="/signup">Register Here</Link>
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

export default Login;
