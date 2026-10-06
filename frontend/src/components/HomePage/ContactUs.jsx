import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSubmitContact } from '../../hooks/queries/useContactQueries';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

/* ── Animations ── */
const float = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
  100% { transform: translateY(0px) scale(1); }
`;

/* ── Styled Components ── */
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f172a;
  background-image:
    radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 0.2) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 0.2) 0, transparent 50%);
  padding: 80px 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -5%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0,212,255,0.08), transparent 60%);
    border-radius: 50%;
    filter: blur(80px);
    z-index: 1;
    animation: ${float} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    right: -5%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(124,58,237,0.08), transparent 60%);
    border-radius: 50%;
    filter: blur(80px);
    z-index: 1;
    animation: ${float} 10s ease-in-out infinite reverse;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  z-index: 2;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

/* ── Left Side: Contact Info ── */
const InfoSection = styled.div`
  padding: 50px 40px;
  background: rgba(0, 212, 255, 0.02);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 212, 255, 0.1);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0,212,255,0.05) 0%, transparent 50%, rgba(124,58,237,0.05) 100%);
    pointer-events: none;
  }
`;

const InfoHeader = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #ffffff, #00D4FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconWrapper = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: rgba(0,212,255,0.1);
  border: 1px solid rgba(0,212,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00D4FF;
  font-size: 1.2rem;
  box-shadow: 0 0 20px rgba(0,212,255,0.1);
  flex-shrink: 0;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemLabel = styled.span`
  font-size: 0.85rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
  font-weight: 600;
`;

const ItemValue = styled.span`
  font-size: 1.1rem;
  color: #e2e8f0;
  font-weight: 500;
`;

/* ── Right Side: Form ── */
const FormSection = styled.div`
  padding: 50px 40px;
  background: rgba(10, 15, 30, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const StyledInput = styled(Field)`
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }

  &:focus {
    background: rgba(0, 212, 255, 0.05);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
  }

  ${props => props.as === 'textarea' && `
    resize: vertical;
    min-height: 150px;
  `}
`;

const StyledError = styled(ErrorMessage)`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 8px;
  display: block;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '⚠';
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #00D4FF, #0066FF);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 10px 20px rgba(0, 212, 255, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 212, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackLinkWrapper = styled.div`
  margin-top: 32px;
  text-align: center;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #00D4FF;
  }
`;


const ContactUs = () => {
  const { mutateAsync: submitContact } = useSubmitContact();

  return (
    <PageWrapper>
      <ContentContainer>
        
        {/* Left Side Info */}
        <InfoSection>
          <InfoHeader>
            <Title>Let's Connect</Title>
            <Subtitle>
              Have a question about our logistics services or need a custom quote? 
              Our team of experts is ready to help you accelerate your business.
            </Subtitle>
          </InfoHeader>

          <ContactList>
            <ContactItem>
              <IconWrapper><i className="fas fa-map-marker-alt"></i></IconWrapper>
              <ItemDetails>
                <ItemLabel>Headquarters</ItemLabel>
                <ItemValue>Cyber City, Neon Block 4</ItemValue>
              </ItemDetails>
            </ContactItem>
            <ContactItem>
              <IconWrapper><i className="fas fa-phone-alt"></i></IconWrapper>
              <ItemDetails>
                <ItemLabel>Phone Support</ItemLabel>
                <ItemValue>+91 11 49090585</ItemValue>
              </ItemDetails>
            </ContactItem>
            <ContactItem>
              <IconWrapper><i className="fas fa-envelope"></i></IconWrapper>
              <ItemDetails>
                <ItemLabel>Email Address</ItemLabel>
                <ItemValue>info@driveonryd.com</ItemValue>
              </ItemDetails>
            </ContactItem>
          </ContactList>
        </InfoSection>

        {/* Right Side Form */}
        <FormSection>
          <Formik
            initialValues={{ name: '', phone_number: '', email: '', message: '' }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              phone_number: Yup.string().required('Phone number is required'),
              email: Yup.string().email('Invalid email address').required('Email is required'),
              message: Yup.string().required('Message is required'),
            })}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              try {
                await submitContact(values);
                resetForm();
                alert("Message sent successfully!");
              } catch (err) {
                // error handled by mutation
                alert("Failed to send message.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormGroup>
                  <StyledLabel htmlFor="name">Full Name</StyledLabel>
                  <StyledInput 
                    name="name" 
                    type="text" 
                    placeholder="Enter your name" 
                  />
                  <StyledError name="name" component="span" />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormGroup>
                    <StyledLabel htmlFor="phone_number">Phone Number</StyledLabel>
                    <StyledInput
                      name="phone_number"
                      type="text"
                      placeholder="e.g. +91 9876543210"
                    />
                    <StyledError name="phone_number" component="span" />
                  </FormGroup>

                  <FormGroup>
                    <StyledLabel htmlFor="email">Email Address</StyledLabel>
                    <StyledInput
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                    />
                    <StyledError name="email" component="span" />
                  </FormGroup>
                </div>

                <FormGroup>
                  <StyledLabel htmlFor="message">Message</StyledLabel>
                  <StyledInput
                    name="message"
                    as="textarea"
                    placeholder="How can we help your business?"
                  />
                  <StyledError name="message" component="span" />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </SubmitButton>

                <BackLinkWrapper>
                  <BackLink to="/">
                    <i className="fas fa-arrow-left"></i> Return to Homepage
                  </BackLink>
                </BackLinkWrapper>
              </Form>
            )}
          </Formik>
        </FormSection>

      </ContentContainer>
    </PageWrapper>
  );
};

export default ContactUs;
