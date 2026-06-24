import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffffff;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6);
    border-radius: 2px;
  }
`;

const SectionDesc = styled.p`
  color: #94a3b8;
  font-size: 1.15rem;
  max-width: 750px;
  margin: 0 auto 60px;
`;

const ServiceCard = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 380px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  
  &:hover .bg-img {
    transform: scale(1.1);
  }
  
  &:hover .overlay {
    background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.3) 100%);
  }
  
  &:hover .content {
    transform: translateY(-15px);
  }
`;

const BgImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%);
  transition: background 0.4s ease;
  z-index: 2;
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  z-index: 3;
  transition: transform 0.4s ease;
`;

const Title = styled.h4`
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
`;

const Desc = styled.p`
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  opacity: 0.9;
`;

const ReadMore = styled.a`
  display: inline-flex;
  align-items: center;
  color: #60a5fa;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;

  i {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #93c5fd;
    i {
      transform: translateX(5px);
    }
  }
`;

const Services = () => {
  const servicesData = [
    {
      title: 'National Transportation',
      desc: 'Comprehensive road transportation services connecting every corner of India with high-capacity fleets and experienced drivers.',
      img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Supply Chain Management',
      desc: 'End-to-end supply chain solutions optimizing your inventory, reducing costs, and ensuring seamless product flow to the market.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Expedited Shipping',
      desc: 'Time-critical delivery services designed to meet your most urgent deadlines with priority handling and dedicated routes.',
      img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Last-Mile Delivery',
      desc: 'Efficient and secure delivery directly to your customers\' doors, ensuring a positive final touchpoint for your brand.',
      img: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Freight Forwarding',
      desc: 'Expert coordination and shipment of goods across domestic boundaries with complete customs and documentation support.',
      img: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: '24/7 Support Logistics',
      desc: 'Round-the-clock tracking and dedicated customer support to provide you with complete visibility and peace of mind.',
      img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <SectionWrapper id="services">
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <SectionTitle>Premium Logistics Services</SectionTitle>
            <SectionDesc>
              We provide comprehensive, tailored logistics solutions designed to drive efficiency, reduce costs, and accelerate your business growth.
            </SectionDesc>
          </div>
        </div>

        <div className="row mt-4">
          {servicesData.map((service, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <ServiceCard>
                <BgImage className="bg-img" src={service.img} />
                <Overlay className="overlay" />
                <Content className="content">
                  <Title>{service.title}</Title>
                  <Desc>{service.desc}</Desc>
                  <ReadMore href="#/">
                    Read More <i className="fas fa-arrow-right"></i>
                  </ReadMore>
                </Content>
              </ServiceCard>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Services;
