import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
`;

const SectionTitle = styled.h3`
  font-size: 2.5rem;
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
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }
`;

const SectionDesc = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 50px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 40px 30px;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(59, 130, 246, 0.4);
  }
`;

const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #3b82f6;
  margin-bottom: 20px;
  object-fit: cover;
`;

const Name = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 5px;
`;

const Role = styled.p`
  font-size: 0.9rem;
  color: #3b82f6;
  margin-bottom: 20px;
`;

const Quote = styled.p`
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.6;
  font-style: italic;

  i {
    color: #8b5cf6;
    margin-right: 10px;
    font-size: 1.2rem;
  }
`;

const Testimonial = () => {
  return (
    <SectionWrapper id="clients">
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <SectionTitle>What Our Clients Say</SectionTitle>
            <SectionDesc>
              Don't just take our word for it. Read how our logistics solutions have helped businesses scale and succeed across the country.
            </SectionDesc>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
            <Card>
              <div className="text-center">
                <Avatar src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).webp" alt="Client 1" />
                <Name>Maria Smantha</Name>
                <Role>Supply Chain Manager</Role>
                <Quote>
                  <i className="fas fa-quote-left"></i>
                  DriveOnRyd transformed our entire vehicle rental experience. Their service is unparalleled and incredibly reliable.
                </Quote>
              </div>
            </Card>
          </div>
          
          <div className="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
            <Card>
              <div className="text-center">
                <Avatar src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).webp" alt="Client 2" />
                <Name>Lisa Cudrow</Name>
                <Role>Operations Director</Role>
                <Quote>
                  <i className="fas fa-quote-left"></i>
                  We've been partnering with them for freight forwarding for over 3 years. The real-time tracking and 24/7 support give us immense peace of mind.
                </Quote>
              </div>
            </Card>
          </div>
          
          <div className="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
            <Card>
              <div className="text-center">
                <Avatar src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp" alt="Client 3" />
                <Name>John Smith</Name>
                <Role>CEO, RetailCorp</Role>
                <Quote>
                  <i className="fas fa-quote-left"></i>
                  Their last-mile delivery service has dramatically improved our customer satisfaction rates. Professional, timely, and secure!
                </Quote>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Testimonial;
