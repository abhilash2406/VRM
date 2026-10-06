import React, { useState } from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  padding: 100px 0;
  background: transparent;
  color: #f8fafc;
  position: relative;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 70px;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ffffff, #00D4FF, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  letter-spacing: -0.5px;
`;

const SectionDesc = styled.p`
  color: #94a3b8;
  font-size: 1.15rem;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
`;

/* --- 3D Flip Card Styles --- */

const FlipContainer = styled.div`
  perspective: 1000px;
  height: 420px;
  cursor: pointer;
`;

const Flipper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  transform: ${props => (props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  overflow: hidden;
  background: #0a0f1e;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const FrontFace = styled(CardFace)`
  /* Front specific styles */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(0,212,255,0.4), transparent, rgba(124,58,237,0.4));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 10;
  }

  ${FlipContainer}:hover & {
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0,212,255,0.15);
    
    &::before {
      opacity: 1;
    }

    .bg-img {
      transform: scale(1.08);
      filter: saturate(1.2) brightness(1.1);
    }
    
    .overlay {
      background: linear-gradient(to top, rgba(3,7,18,0.98) 0%, rgba(3,7,18,0.7) 40%, rgba(0,212,255,0.15) 100%);
    }
    
    .content {
      transform: translateY(-10px);
    }
    
    .read-more {
      color: #00D4FF;
      letter-spacing: 1px;
      
      i {
        transform: translateX(8px);
      }
    }
  }
`;

const BackFace = styled(CardFace)`
  transform: rotateY(180deg);
  background: linear-gradient(135deg, rgba(7, 18, 41, 0.95), rgba(3, 7, 18, 0.98));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
  border: 1px solid rgba(0,212,255,0.2);
  box-shadow: 0 0 30px rgba(0,212,255,0.1);

  /* Inner glow */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0,212,255,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

/* --- Elements --- */

const BgImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-color: #071229; /* Fallback color if image fails */
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  filter: saturate(0.8) brightness(0.8);
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(3,7,18,0.98) 0%, rgba(3,7,18,0.4) 60%, transparent 100%);
  transition: background 0.5s ease;
  z-index: 2;
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px 32px;
  z-index: 3;
  transition: transform 0.5s ease;
`;

const Title = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
`;

const Desc = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
  transition: color 0.3s ease;
`;

const ReadMore = styled.div`
  display: inline-flex;
  align-items: center;
  color: #cbd5e1;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  pointer-events: none; /* Let the card handle the click */

  i {
    margin-left: 10px;
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }
`;

const BackTitle = styled.h4`
  font-size: 1.4rem;
  font-weight: 700;
  color: #00D4FF;
  margin-bottom: 20px;
`;

const BackDetails = styled.p`
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 30px;
`;

const BackBtn = styled.button`
  background: transparent;
  border: 1px solid #00D4FF;
  color: #00D4FF;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0,212,255,0.1);
    box-shadow: 0 0 15px rgba(0,212,255,0.3);
  }
`;

const ServiceCardComponent = ({ service }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <FlipContainer onClick={() => setIsFlipped(!isFlipped)}>
      <Flipper isFlipped={isFlipped}>
        
        {/* FRONT */}
        <FrontFace>
          <BgImage className="bg-img" src={service.img} />
          <Overlay className="overlay" />
          <Content className="content">
            <Title>{service.title}</Title>
            <Desc>{service.desc}</Desc>
            <ReadMore className="read-more">
              Read More <i className="fas fa-arrow-right"></i>
            </ReadMore>
          </Content>
        </FrontFace>
        
        {/* BACK */}
        <BackFace>
          <BackTitle>{service.title}</BackTitle>
          <BackDetails>{service.longDesc}</BackDetails>
          <BackBtn onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}>
            <i className="fas fa-undo me-2"></i> Go Back
          </BackBtn>
        </BackFace>

      </Flipper>
    </FlipContainer>
  );
};

const Services = () => {
  const servicesData = [
    {
      title: 'National Transportation',
      desc: 'Comprehensive road transportation connecting every corner of India with high-capacity fleets and smart routing.',
      longDesc: 'Our national network leverages AI-driven smart routing and a modern fleet of high-capacity vehicles. We ensure real-time tracking, minimal transit times, and secure handling for freight of all sizes across state borders.',
      // Updated valid images
      img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Supply Chain Management',
      desc: 'End-to-end solutions optimizing inventory, reducing costs, and ensuring seamless product flow to the market.',
      longDesc: 'Transform your logistics with our end-to-end supply chain solutions. We offer predictive inventory management, automated warehouse integration, and data analytics to drastically reduce operational costs.',
      // Changed this specific failing image to a reliable logistics/warehouse image
      img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Expedited Shipping',
      desc: 'Time-critical delivery services designed to meet your most urgent deadlines with priority handling.',
      longDesc: 'When time is critical, our expedited shipping guarantees priority handling and dedicated routes. Benefit from expedited customs clearance and 24/7 dedicated fleet support for emergency deliveries.',
      img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Last-Mile Delivery',
      desc: 'Efficient and secure delivery directly to doors, ensuring a flawless final touchpoint for your brand.',
      longDesc: 'Our last-mile network is optimized for dense urban environments, utilizing agile vehicles and smart dispatching to ensure rapid, secure, and customer-friendly deliveries right to the doorstep.',
      img: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Freight Forwarding',
      desc: 'Expert coordination and shipment of goods across boundaries with complete customs documentation support.',
      longDesc: 'Seamlessly navigate international boundaries with our expert freight forwarding. We handle all complex customs documentation, compliance checks, and multi-modal transport coordination.',
      img: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: '24/7 Support Logistics',
      desc: 'Round-the-clock tracking and dedicated AI-assisted support for complete visibility and peace of mind.',
      longDesc: 'Experience complete visibility with our 24/7 monitoring center. Get instant alerts, AI-assisted rerouting during disruptions, and dedicated human support available around the clock.',
      img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <SectionWrapper id="services">
      <SectionHeader>
        <SectionTitle>Premium Logistics Services</SectionTitle>
        <SectionDesc>
          We provide comprehensive, tailored logistics solutions designed to drive efficiency, reduce costs, and accelerate your business in the modern era.
        </SectionDesc>
      </SectionHeader>

      <Grid>
        {servicesData.map((service, index) => (
          <ServiceCardComponent key={index} service={service} />
        ))}
      </Grid>
    </SectionWrapper>
  );
};

export default Services;
