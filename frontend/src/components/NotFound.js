import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const NotFoundContainer = styled.div`
  min-height: ${(props) => (props.isComponent ? '400px' : '100vh')};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isComponent ? 'transparent' : '#0f172a')};
  background-image: ${(props) => (props.isComponent ? 'none' : `
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,0.2) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(339,49%,30%,0.2) 0, transparent 50%)
  `)};
  color: #f8fafc;
  font-family: 'Inter', 'Orbitron', sans-serif;
  text-align: center;
  padding: 20px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  background: ${(props) => (props.isComponent ? 'transparent' : 'rgba(15, 23, 42, 0.6)')};
  backdrop-filter: ${(props) => (props.isComponent ? 'none' : 'blur(20px)')};
  -webkit-backdrop-filter: ${(props) => (props.isComponent ? 'none' : 'blur(20px)')};
  border: ${(props) => (props.isComponent ? 'none' : '1px solid rgba(255, 255, 255, 0.1)')};
  padding: ${(props) => (props.isComponent ? '20px' : '60px 40px')};
  border-radius: ${(props) => (props.isComponent ? '0' : '24px')};
  max-width: 600px;
  width: 100%;
  box-shadow: ${(props) => (props.isComponent ? 'none' : '0 20px 40px rgba(0, 0, 0, 0.4)')};
`;

const ErrorCode = styled.h1`
  font-size: ${(props) => (props.isComponent ? '5rem' : '8rem')};
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #00D4FF, #0066FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${float} 6s ease-in-out infinite;
  text-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
`;

const IconWrapper = styled.div`
  color: #00D4FF;
  animation: ${float} 6s ease-in-out infinite;
  margin-bottom: 16px;
  i {
    font-size: 5rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 20px;
  color: #fff;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  margin-top: 16px;
  margin-bottom: ${(props) => (props.isComponent ? '0' : '32px')};
  line-height: 1.6;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(90deg, #00D4FF, #0066FF);
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.5);
    color: #fff;
  }
`;

const NotFound = ({ isComponent, title, description, code, icon }) => {
  return (
    <NotFoundContainer isComponent={isComponent}>
      <ContentWrapper isComponent={isComponent}>
        {code && <ErrorCode isComponent={isComponent}>{code}</ErrorCode>}
        {icon && <IconWrapper><i className={icon}></i></IconWrapper>}
        <Title>{title || 'Page Not Found'}</Title>
        <Description isComponent={isComponent}>
          {description || 'Oops! It seems like you took a wrong turn. The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
        </Description>
        {!isComponent && (
          <HomeButton to="/">
            <i className="bi-house-door me-2"></i> Back to Home
          </HomeButton>
        )}
      </ContentWrapper>
    </NotFoundContainer>
  );
};

export default NotFound;
