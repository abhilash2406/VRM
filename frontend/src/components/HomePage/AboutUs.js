import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    padding: '0',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
    overflowY: 'auto',
    backgroundColor: '#0f172a'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000
  }
};

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AboutContainer = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
  font-family: 'Inter', sans-serif;
`;

const HeroSection = styled.section`
  padding: 80px 20px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.15rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  position: relative;
  z-index: 1;
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextBlock = styled.div`
  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #ffffff;
  }

  p {
    color: #cbd5e1;
    font-size: 1.05rem;
    line-height: 1.7;
    margin-bottom: 15px;
  }
`;

const ImageBlock = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const StatsSection = styled.section`
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 40px 20px;
`;

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px;
  text-align: center;
`;

const StatItem = styled.div`
  h3 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #60a5fa;
    margin-bottom: 5px;
  }
  p {
    color: #94a3b8;
    font-size: 0.95rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const AboutUsModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="About Us"
      ariaHideApp={false}
    >
      <CloseButton onClick={onRequestClose}>&times;</CloseButton>
      <AboutContainer>
        <HeroSection>
          <Title>Your Complete Mobility & Logistics Partner</Title>
          <Subtitle>
            DriveOnRyd is India's most comprehensive platform for mobility and transportation. Whether you need to rent a two-wheeler for a quick commute, hire an expert driver on demand, or orchestrate complex freight logistics, we connect you with reliable solutions seamlessly.
          </Subtitle>
        </HeroSection>

        <StatsSection>
          <StatsGrid>
            <StatItem>
              <h3>5k+</h3>
              <p>Rental Vehicles</p>
            </StatItem>
            <StatItem>
              <h3>2k+</h3>
              <p>Expert Drivers</p>
            </StatItem>
            <StatItem>
              <h3>100+</h3>
              <p>Cities Served</p>
            </StatItem>
            <StatItem>
              <h3>24/7</h3>
              <p>Support</p>
            </StatItem>
          </StatsGrid>
        </StatsSection>

        <ContentSection>
          <ImageBlock>
            <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="DriveOnRyd Services" />
          </ImageBlock>
          <TextBlock>
            <h2>Our Mission & Vision</h2>
            <p>
              At DriveOnRyd, our mission is to provide flexible, efficient, and accessible transportation solutions for individuals and businesses alike. From affordable daily vehicle rentals to full-scale supply chain logistics, we empower our users to move freely and without constraints.
            </p>
            <p>
              We envision a connected India where mobility is never a barrier. By leveraging advanced technology, a diverse vehicle fleet, and a network of verified drivers, we are building an ecosystem that caters to every journey.
            </p>
            <p>
              Whether you are looking for a weekend scooter rental, a professional chauffeur for a business trip, or a dedicated truck for interstate hauling, our commitment to safety, transparency, and customer satisfaction remains our top priority.
            </p>
          </TextBlock>
        </ContentSection>
      </AboutContainer>
    </Modal>
  );
};

export default AboutUsModal;
