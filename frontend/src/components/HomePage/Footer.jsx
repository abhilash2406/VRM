import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import AboutUsModal from './AboutUs';

/* ── Keyframes ── */
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

/* ── Modal Styles ── */
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '800px',
    height: '60vh',
    padding: '0',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: '16px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0,212,255,0.1)',
    overflow: 'hidden',
    backgroundColor: '#0a0f1e',
    zIndex: 1001
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000
  }
};

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: rgba(0,212,255,0.15);
  color: #00D4FF;
  border: 1px solid rgba(0,212,255,0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0,212,255,0.3);
    box-shadow: 0 0 15px rgba(0,212,255,0.4);
    transform: rotate(90deg);
  }
`;

/* ── Footer Styled Components ── */
const FooterWrapper = styled.footer`
  background: #0f172a;
  color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;

  /* Ambient glow orbs */
  &::before {
    content: '';
    position: absolute;
    top: -120px;
    left: -80px;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -60px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(120,60,255,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const TopAccent = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent, #00D4FF, #0066FF, #7c3aed, #00D4FF, transparent);
  background-size: 200% 100%;
  animation: ${shimmer} 4s linear infinite;
`;

const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 72px 32px 0;
  position: relative;
  z-index: 1;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 56px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  gap: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
`;

const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BrandLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #00D4FF, #0066FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0,212,255,0.3);
  flex-shrink: 0;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandName = styled.span`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00D4FF, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
`;

const BrandTagline = styled.span`
  font-size: 0.7rem;
  color: #67E8F9;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  font-weight: 500;
`;

const NewsletterBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const NewsletterInput = styled.input`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 12px 18px;
  color: #e2e8f0;
  font-size: 0.88rem;
  outline: none;
  width: 240px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #475569;
  }

  &:focus {
    border-color: rgba(0,212,255,0.4);
    background: rgba(0,212,255,0.04);
    box-shadow: 0 0 20px rgba(0,212,255,0.08);
  }

  @media (max-width: 768px) {
    flex: 1;
    width: auto;
  }
`;

const NewsletterBtn = styled.button`
  background: linear-gradient(135deg, #00D4FF, #0066FF);
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  color: #fff;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0,212,255,0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,212,255,0.4);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
  gap: 48px;
  padding: 56px 0;

  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #94a3b8;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 18px;
    height: 2px;
    background: linear-gradient(90deg, #00D4FF, #0066FF);
    border-radius: 2px;
    flex-shrink: 0;
  }
`;

const Description = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.75;
  margin: 0 0 28px;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialIcon = styled.a`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(0,212,255,0.1);
    border-color: rgba(0,212,255,0.3);
    color: #00D4FF;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,212,255,0.15);
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FooterLink = styled.a`
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #00D4FF;
    transform: translateX(4px);
  }
`;

const FooterRouterLink = styled(Link)`
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #00D4FF;
    transform: translateX(4px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
`;

const ContactIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00D4FF;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ContactLabel = styled.span`
  font-size: 0.78rem;
  color: #475569;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const ContactValue = styled.span`
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.5;

  a {
    color: #00D4FF;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #67E8F9;
    }
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 580px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #334155;
  font-size: 0.82rem;
  margin: 0;
  letter-spacing: 0.3px;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const BottomLink = styled.a`
  color: #475569;
  text-decoration: none;
  font-size: 0.82rem;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: #00D4FF;
  }
`;

const ScrollTopBtn = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(0,212,255,0.2);
  background: rgba(3,7,18,0.9);
  backdrop-filter: blur(12px);
  color: #00D4FF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  pointer-events: ${({ visible }) => (visible ? 'all' : 'none')};

  &:hover {
    background: rgba(0,212,255,0.1);
    border-color: rgba(0,212,255,0.4);
    box-shadow: 0 8px 30px rgba(0,212,255,0.2);
    transform: translateY(-3px);
  }
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34,197,94,0.6);
  animation: ${pulse} 2s ease-in-out infinite;
  display: inline-block;
`;

/* ── Footer Component ── */
const Footer = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [aboutModalIsOpen, setAboutModalIsOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FooterWrapper>
      <TopAccent />

      <MainContent>
        {/* ── Top: Brand + Newsletter ── */}
        <TopSection>
          <BrandBlock>
            <BrandLogo>
              <img src="/logo.png" alt="DriveOnRyd" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'brightness(2)' }} />
            </BrandLogo>
            <BrandText>
              <BrandName>DriveOnRyd</BrandName>
              <BrandTagline>Ride Without Limits</BrandTagline>
            </BrandText>
          </BrandBlock>

          <NewsletterBlock>
            <NewsletterInput type="email" placeholder="Your email address" />
            <NewsletterBtn>Subscribe</NewsletterBtn>
          </NewsletterBlock>
        </TopSection>

        {/* ── Main Grid ── */}
        <Grid>
          {/* About Column */}
          <Column>
            <ColumnTitle>About Us</ColumnTitle>
            <Description>
              Premium vehicle rental platform delivering reliability, comfort, and excellence. 
              Book your ride in seconds and experience seamless transportation across India.
            </Description>
            <SocialRow>
              <SocialIcon href="https://www.facebook.com/greatwaygroup" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </SocialIcon>
              <SocialIcon href="https://twitter.com/greatway" target="_blank" rel="noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </SocialIcon>
              <SocialIcon href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </SocialIcon>
            </SocialRow>
          </Column>

          {/* Quick Links */}
          <Column>
            <ColumnTitle>Quick Links</ColumnTitle>
            <LinkList>
              <li><FooterRouterLink to="/">Home</FooterRouterLink></li>
              <li><FooterLink as="span" onClick={() => setAboutModalIsOpen(true)}>About Us</FooterLink></li>
              <li><FooterRouterLink to="/image-gallery">Gallery</FooterRouterLink></li>
              <li><FooterRouterLink to="/contact-us">Contact Us</FooterRouterLink></li>
              <li><FooterRouterLink to="/login">Book a Ride</FooterRouterLink></li>
            </LinkList>
          </Column>

          {/* Services */}
          <Column>
            <ColumnTitle>Services</ColumnTitle>
            <LinkList>
              <li><FooterLink href="/#services">Self Drive Rental</FooterLink></li>
              <li><FooterLink href="/#services">Chauffeur Service</FooterLink></li>
              <li><FooterLink href="/#services">Airport Transfers</FooterLink></li>
              <li><FooterLink href="/#services">Corporate Rentals</FooterLink></li>
              <li><FooterLink as="span" onClick={() => setModalIsOpen(true)}>Branch Locator</FooterLink></li>
            </LinkList>
          </Column>

          {/* Contact */}
          <Column>
            <ColumnTitle>Get in Touch</ColumnTitle>
            <ContactItem>
              <ContactIcon><i className="fas fa-map-marker-alt"></i></ContactIcon>
              <ContactDetails>
                <ContactLabel>Head Office</ContactLabel>
                <ContactValue>DriveOnRyd, India</ContactValue>
              </ContactDetails>
            </ContactItem>
            <ContactItem>
              <ContactIcon><i className="fas fa-phone-alt"></i></ContactIcon>
              <ContactDetails>
                <ContactLabel>Phone</ContactLabel>
                <ContactValue>+91 11 49090585</ContactValue>
              </ContactDetails>
            </ContactItem>
            <ContactItem>
              <ContactIcon><i className="fas fa-envelope"></i></ContactIcon>
              <ContactDetails>
                <ContactLabel>Email</ContactLabel>
                <ContactValue><a href="mailto:info@driveonryd.com">info@driveonryd.com</a></ContactValue>
              </ContactDetails>
            </ContactItem>
            <ContactItem>
              <ContactIcon><StatusDot /></ContactIcon>
              <ContactDetails>
                <ContactLabel>Availability</ContactLabel>
                <ContactValue>24/7 Support Available</ContactValue>
              </ContactDetails>
            </ContactItem>
          </Column>
        </Grid>
      </MainContent>

      {/* ── Bottom Bar ── */}
      <BottomBar>
        <Copyright>
          &copy; {new Date().getFullYear()} DriveOnRyd. All rights reserved.
        </Copyright>
        <BottomLinks>
          <BottomLink href="#">Privacy Policy</BottomLink>
          <BottomLink href="#">Terms of Service</BottomLink>
        </BottomLinks>
      </BottomBar>

      {/* ── Scroll to Top ── */}
      <ScrollTopBtn visible={showScroll} onClick={scrollToTop} aria-label="Scroll to top">
        <i className="fas fa-arrow-up"></i>
      </ScrollTopBtn>

      {/* ── Branch Locator Modal ── */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Branch Locator Map"
        ariaHideApp={false}
      >
        <CloseButton onClick={() => setModalIsOpen(false)}>&times;</CloseButton>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5620658428867!2d77.227321!3d28.612912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1689234567890!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Branch Locator Map"
        ></iframe>
      </Modal>
      <AboutUsModal isOpen={aboutModalIsOpen} onRequestClose={() => setAboutModalIsOpen(false)} />
    </FooterWrapper>
  );
};

export default Footer;
