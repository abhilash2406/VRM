import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
`;

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  animation: ${slideDown} 0.5s ease forwards;
  background: ${({ scrolled }) =>
    scrolled
      ? 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)'
      : 'linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(30,41,59,0.75) 100%)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ scrolled }) => (scrolled ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)')};
  box-shadow: ${({ scrolled }) => (scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none')};
  transition: all 0.4s ease;
  padding: 0 40px;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00D4FF, #0066FF, #00D4FF);
    opacity: ${({ scrolled }) => (scrolled ? 1 : 0)};
    transition: opacity 0.4s ease;
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
`;

const LogoBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;

  img {
    width: 44px;
    height: 44px;
    object-fit: contain;
    filter: drop-shadow(0 0 12px rgba(0,212,255,0.8));
  }

  span.brand-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.6rem;
    font-weight: 900;
    letter-spacing: 1px;
    background: linear-gradient(90deg, #00D4FF, #ffffff, #00D4FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }

  span.tagline {
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #67E8F9;
    -webkit-text-fill-color: #67E8F9;
    background: none;
    line-height: 1;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  position: relative;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;

  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #00D4FF, #0066FF);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #00D4FF;
    background: rgba(0, 212, 255, 0.08);

    &::after {
      width: calc(100% - 32px);
    }
  }
`;

const LoginBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 50px;
  background: linear-gradient(135deg, #00D4FF, #0066FF);
  color: #ffffff !important;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none !important;
  letter-spacing: 0.4px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
  margin-left: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 212, 255, 0.6);
    background: linear-gradient(135deg, #0066FF, #00D4FF);
  }

  i {
    font-size: 0.85rem;
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.18);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Spacer = styled.div`
  height: 72px;
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <NavWrapper scrolled={scrolled}>
        <Inner>
          <LogoBrand to="/">
            <img src="/logo.png" alt="DriveOnRyd Logo" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-name">DriveOnRyd</span>
              <span className="tagline">Ride Without Limits</span>
            </div>
          </LogoBrand>

          <NavLinks>
            <NavItem to="/">Home</NavItem>
            <NavItem to="/image-gallery">Gallery</NavItem>
            <NavItem to="/contact-us">Contact Us</NavItem>
            <LoginBtn href="http://localhost:3001/login">
              <i className="fas fa-user"></i>
              Login / Register
            </LoginBtn>
          </NavLinks>

          <MobileToggle>
            <i className="fas fa-bars"></i>
          </MobileToggle>
        </Inner>
      </NavWrapper>
      <Spacer />
    </>
  );
};

export default Header;
