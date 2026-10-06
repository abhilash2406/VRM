import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const SectionWrapper = styled.section`
  padding: 100px 0;
  background: #0f172a;
  color: #f8fafc;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ffffff, #00D4FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  letter-spacing: -0.5px;
`;

const SectionDesc = styled.p`
  color: #94a3b8;
  font-size: 1.15rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Card = styled.div`
  background: rgba(0, 212, 255, 0.02);
  border-radius: 20px;
  padding: 40px 30px;
  border: 1px solid rgba(0, 212, 255, 0.1);
  backdrop-filter: blur(12px);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00D4FF, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-10px);
    background: rgba(0, 212, 255, 0.05);
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 212, 255, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

const QuoteIcon = styled.div`
  font-size: 2rem;
  color: rgba(0, 212, 255, 0.4);
  margin-bottom: 20px;
`;

const Quote = styled.p`
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.7;
  font-style: italic;
  flex-grow: 1;
  margin-bottom: 30px;
`;

const AuthorBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 24px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #00D4FF, #7c3aed);
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #060a14;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
`;

const Role = styled.span`
  font-size: 0.85rem;
  color: #00D4FF;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const Testimonial = () => {
  const testimonials = [
    {
      name: 'Maria Smantha',
      role: 'Supply Chain Manager',
      quote: "DriveOnRyd transformed our entire vehicle rental experience. Their service is unparalleled, incredibly reliable, and fits perfectly into our modern workflow.",
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).webp'
    },
    {
      name: 'Lisa Cudrow',
      role: 'Operations Director',
      quote: "We've been partnering with them for freight forwarding for over 3 years. The real-time tracking and 24/7 support give us immense peace of mind.",
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).webp'
    },
    {
      name: 'John Smith',
      role: 'CEO, RetailCorp',
      quote: "Their last-mile delivery service has dramatically improved our customer satisfaction rates. Professional, timely, secure, and always pushing boundaries.",
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp'
    }
  ];

  return (
    <SectionWrapper id="clients">
      <SectionHeader>
        <SectionTitle>What Our Clients Say</SectionTitle>
        <SectionDesc>
          Don't just take our word for it. Read how our premium solutions have empowered businesses to scale and succeed.
        </SectionDesc>
      </SectionHeader>

      <Grid>
        {testimonials.map((test, index) => (
          <Card key={index}>
            <QuoteIcon>
              <i className="fas fa-quote-left"></i>
            </QuoteIcon>
            <Quote>"{test.quote}"</Quote>
            <AuthorBlock>
              <Avatar>
                <img src={test.avatar} alt={test.name} />
              </Avatar>
              <AuthorInfo>
                <Name>{test.name}</Name>
                <Role>{test.role}</Role>
              </AuthorInfo>
            </AuthorBlock>
          </Card>
        ))}
      </Grid>
    </SectionWrapper>
  );
};

export default Testimonial;
