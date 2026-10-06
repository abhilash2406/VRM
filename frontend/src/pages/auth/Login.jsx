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

/* ── Keyframe Animations ── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnim = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

/* ── Styled Components (Dark Slate #0f172a & Cyan/Blue Theme) ── */
const AuthPageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #050a33 0%, #05081f 50%, #071229 100%);
  padding: 40px 20px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 24px 16px;
    align-items: flex-start;
  }
`;

const AmbientGlow = styled.div`
  position: absolute;
  top: ${props => props.top || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  width: ${props => props.size || '500px'};
  height: ${props => props.size || '500px'};
  border-radius: 50%;
  background: ${props => props.color || 'rgba(0, 102, 255, 0.2)'};
  filter: blur(120px);
  pointer-events: none;
  z-index: 1;
`;

const CloseButton = styled(Link)`
  position: absolute;
  top: 32px;
  right: 36px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(20, 30, 50, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 102, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 1.1rem;
  text-decoration: none;
  z-index: 20;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.15);
    border-color: #00D4FF;
    color: #ffffff;
    transform: scale(1.05);
  }

  @media (max-width: 900px) {
    top: 20px;
    right: 20px;
    width: 38px;
    height: 38px;
    font-size: 0.95rem;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1140px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 60px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 500px;
    margin: 40px auto 20px;
  }
`;

/* ── Left Column: Brand & Value Prop ── */
const LeftBrandColumn = styled.div`
  color: #ffffff;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 960px) {
    text-align: center;
  }
`;

const BrandLogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  margin-bottom: 32px;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    filter: drop-shadow(0 0 16px rgba(0, 102, 255, 0.85));
    animation: ${floatAnim} 4s ease-in-out infinite;
  }
`;

const BrandText = styled.span`
  font-family: 'Orbitron', sans-serif;
  font-size: 2.1rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.5px;
  line-height: 1.1;

  span {
    background: linear-gradient(90deg, #00D4FF, #00D4FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const BrandTagline = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #93c5fd;
  text-transform: uppercase;
  margin-top: 3px;
`;

const HeroHeading = styled.h1`
  font-size: 3.4rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  margin: 0 0 16px 0;
  letter-spacing: -1px;

  @media (max-width: 960px) {
    font-size: 2.6rem;
  }
`;

const HeroTagline = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00D4FF;
  margin-bottom: 16px;
  letter-spacing: -0.2px;
`;

const HeroDescription = styled.p`
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.65;
  margin-bottom: 36px;
  max-width: 480px;

  @media (max-width: 960px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 960px) {
    display: none;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.98rem;
  font-weight: 500;
  color: #cbd5e1;

  i {
    color: #00D4FF;
    font-size: 1.1rem;
  }
`;

/* ── Right Column: Floating Dark Slate Card with Cyan Accents ── */
const RightCardColumn = styled.div`
  display: flex;
  justify-content: center;
  animation: ${fadeIn} 0.7s ease-out;
`;

const AuthCard = styled.div`
  background: rgba(15, 26, 46, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 102, 255, 0.3);
  border-radius: 28px;
  padding: 44px 38px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 102, 255, 0.15);
  box-sizing: border-box;

  @media (max-width: 500px) {
    padding: 32px 22px;
    border-radius: 22px;
  }
`;

const CardHeader = styled.div`
  margin-bottom: 28px;
  text-align: left;
`;

const CardTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const CardSubtitle = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: #cbd5e1;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(10, 15, 26, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 50px;
  padding: 14px 22px;
  color: #ffffff;
  font-size: 0.98rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: all 0.25s ease;

  &:focus {
    outline: none;
    background: rgba(10, 15, 26, 0.9);
    border-color: #0066FF;
    box-shadow: 0 0 0 4px rgba(0, 102, 255, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const ErrorText = styled.div`
  color: #ff4d4d;
  font-size: 0.82rem;
  margin-top: 6px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  color: #00D4FF;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #00D4FF;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 50px;
  border: none;
  background: #0066FF;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 102, 255, 0.35);
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    background: #0052cc;
    box-shadow: 0 12px 30px rgba(0, 102, 255, 0.55);
  }

  &:active {
    transform: translateY(0);
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
  margin: 24px 0 20px;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.5px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  &::before { margin-right: 1.2em; }
  &::after { margin-left: 1.2em; }
`;

const GoogleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  div {
    border-radius: 50px !important;
  }
`;

const FooterText = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 0.92rem;
  margin: 0;

  a {
    color: #00D4FF;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.2s ease;

    &:hover {
      color: #00D4FF;
      text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
      text-decoration: underline;
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
    <AuthPageWrapper>
      {/* Ambient background glows */}
      <AmbientGlow top="-10%" left="-5%" size="600px" color="rgba(0, 102, 255, 0.25)" />
      <AmbientGlow bottom="-10%" right="15%" size="500px" color="rgba(0, 212, 255, 0.22)" />

      {/* Close button to return to home */}
      <CloseButton to="/" title="Back to Home">
        <i className="fas fa-times"></i>
      </CloseButton>

      <ContentContainer>
        {/* Left column: Brand & welcoming messaging */}
        <LeftBrandColumn>
          <BrandLogoLink to="/">
            <img src="/logo.png" alt="DriveOnRyd Logo" />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <BrandText>
                DriveOn<span>Ryd</span>
              </BrandText>
              <BrandTagline>RIDE WITHOUT LIMITS</BrandTagline>
            </div>
          </BrandLogoLink>

          <HeroHeading>Hey, Hello!</HeroHeading>
          <HeroTagline>Welcome to DriveOnRyd Login</HeroTagline>
          <HeroDescription>
            Sign in to access your premium vehicle fleet, track active rentals, and discover seamless booking without limits.
          </HeroDescription>

          <FeatureList>
            <FeatureItem>
              <i className="fas fa-check-circle"></i>
              <span>Instant keyless vehicle unlock & digital check-in</span>
            </FeatureItem>
            <FeatureItem>
              <i className="fas fa-check-circle"></i>
              <span>Curated fleet of luxury, sports, and electric vehicles</span>
            </FeatureItem>
            <FeatureItem>
              <i className="fas fa-check-circle"></i>
              <span>Transparent pricing with 24/7 dedicated support</span>
            </FeatureItem>
          </FeatureList>
        </LeftBrandColumn>

        {/* Right column: Floating Dark Card in App Theme */}
        <RightCardColumn>
          <AuthCard>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardSubtitle>Please enter your credentials to continue.</CardSubtitle>
            </CardHeader>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  await login(values);
                  resetForm();
                  navigate('/dashboard');
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
                  <FormGroup>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g. user@example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email && <ErrorText><i className="fas fa-exclamation-circle"></i> {errors.email}</ErrorText>}
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
                    {errors.password && touched.password && <ErrorText><i className="fas fa-exclamation-circle"></i> {errors.password}</ErrorText>}
                  </FormGroup>

                  <LoginButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Authenticating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt"></i> Log In
                      </>
                    )}
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
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                  </FooterText>
                </form>
              )}
            </Formik>
          </AuthCard>
        </RightCardColumn>
      </ContentContainer>
    </AuthPageWrapper>
  );
};

export default Login;
