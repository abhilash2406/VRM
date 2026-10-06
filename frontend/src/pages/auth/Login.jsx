import logger from '../../utils/logger';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLogin, useGoogleLogin } from '../../hooks/queries/useAuthQueries';
import { useAuthStore } from '../../store/useAuthStore';
import Loaders from '../../components/Loaders';
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
const SplitLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0f172a;
  background-image:
    radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 0.2) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 0.2) 0, transparent 50%);
  font-family: 'Inter', sans-serif;
`;

const LeftPanel = styled.div`
  flex: 1;
  position: relative;
  display: none;
  background-image: url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;

  @media (min-width: 900px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(3,7,18,0.4) 0%, rgba(3,7,18,0.9) 100%);
  }
`;

const Branding = styled.div`
  position: relative;
  z-index: 10;
`;

const Logo = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  color: #ffffff;
  
  span {
    background: linear-gradient(90deg, #00D4FF, #0066FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const PanelText = styled.div`
  position: relative;
  z-index: 10;
  color: #ffffff;
  max-width: 500px;

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.1;
  }

  p {
    font-size: 1.1rem;
    color: #94a3b8;
    line-height: 1.6;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
  position: relative;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 440px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 40px;
  text-align: left;

  h2 {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 10px;
    font-weight: 700;
  }

  p {
    color: #94a3b8;
    font-size: 1rem;
  }

  /* Show logo on mobile only */
  @media (min-width: 900px) {
    .mobile-logo { display: none; }
  }
`;

const MobileLogo = styled(Logo)`
  font-size: 1.8rem;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(0, 212, 255, 0.05);
    border-color: #00D4FF;
    box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
  }

  &::placeholder {
    color: #475569;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '⚠';
  }
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  color: #00D4FF;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #ffffff;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #00D4FF, #0066FF);
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.25);
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.4);
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
  margin: 32px 0;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 500;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  &::before { margin-right: 1em; }
  &::after { margin-left: 1em; }
`;

const GoogleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const FooterText = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 0.95rem;
  
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

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
  position: absolute;
  top: 40px;
  right: 40px;

  &:hover {
    color: #ffffff;
  }

  @media (max-width: 900px) {
    top: 20px;
    right: 20px;
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
    <SplitLayout>
      <LeftPanel>
        <Branding>
          <Logo>DriveOn<span>Ryd</span></Logo>
        </Branding>
        <PanelText>
          <h1>Welcome Back</h1>
          <p>Sign in to access your premium vehicle fleet, track ongoing rentals, and discover new destinations.</p>
        </PanelText>
      </LeftPanel>

      <RightPanel>
        <BackLink to="/">
          <i className="fas fa-times"></i>
        </BackLink>

        <FormContainer>
          <Header>
            <MobileLogo className="mobile-logo">DriveOn<span>Ryd</span></MobileLogo>
            <h2>Log In</h2>
            <p>Please enter your credentials to continue.</p>
          </Header>

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
                    placeholder="name@company.com"
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
                  <ForgotPasswordLink to="/forgot-password">Forgot password?</ForgotPasswordLink>
                  {errors.password && touched.password && <ErrorText>{errors.password}</ErrorText>}
                </FormGroup>

                <LoginButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Authenticating...' : 'Log In'}
                </LoginButton>

                <Divider>OR CONTINUE WITH</Divider>

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
                  Don't have an account? <Link to="/signup">Register Now</Link>
                </FooterText>
              </form>
            )}
          </Formik>
        </FormContainer>
      </RightPanel>
    </SplitLayout>
  );
};

export default Login;
