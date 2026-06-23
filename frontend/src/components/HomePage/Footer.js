import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
  padding: 80px 0 30px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  position: relative;
  overflow: hidden;

  /* Premium top border gradient */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandDesc = styled.p`
  color: #94a3b8;
  line-height: 1.6;
  margin-top: 20px;
  font-size: 0.95rem;
`;

const Title = styled.h3`
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 45px;
    height: 3px;
    background-color: #3b82f6;
    border-radius: 2px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 14px;
`;

const NavLin = styled.a`
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: #60a5fa;
    transform: translateX(6px);
  }
  
  &::before {
    content: '›';
    margin-right: 8px;
    color: #3b82f6;
    font-size: 1.2rem;
    line-height: 1;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: translateX(-10px);
  }

  &:hover::before {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ContactText = styled.div`
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 16px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  
  i {
    color: #3b82f6;
    margin-top: 4px;
  }
`;

const ContactLink = styled.a`
  color: #60a5fa;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #93c5fd;
    text-decoration: underline;
  }
`;

const SocialIcons = styled.ul`
  list-style: none;
  padding: 0;
  margin: 25px 0 0;
  display: flex;
  gap: 16px;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.1rem;

  &:hover {
    background-color: #3b82f6;
    color: #ffffff;
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const Copyright = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
`;

const ScrollUp = styled.a`
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Footer = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FooterWrapper>
      <Container>
        <Grid>
          <Column>
            <Title style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '1.5px' }}>DriveOnRyd</Title>
            <BrandDesc>
              Leading provider of premium transportation and logistics solutions across India. We deliver reliability, efficiency, and excellence in every mile.
            </BrandDesc>
            <SocialIcons>
              <li>
                <SocialIcon href="https://www.facebook.com/greatwaygroup" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </SocialIcon>
              </li>
              <li>
                <SocialIcon href="https://twitter.com/greatway" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </SocialIcon>
              </li>
              <li>
                <SocialIcon href="https://google.com" target="_blank" rel="noreferrer" aria-label="Google Plus">
                  <i className="fab fa-google-plus-g"></i>
                </SocialIcon>
              </li>
            </SocialIcons>
          </Column>

          <Column>
            <Title>Transportation</Title>
            <List>
              <ListItem><NavLin href="/transport/north-india">North India</NavLin></ListItem>
              <ListItem><NavLin href="/transport/south-india">South India</NavLin></ListItem>
              <ListItem><NavLin href="/transport/assam">Assam</NavLin></ListItem>
              <ListItem><NavLin href="/transport/haryana">Haryana</NavLin></ListItem>
              <ListItem><NavLin href="/transport/punjab">Punjab</NavLin></ListItem>
              <ListItem><NavLin href="/transport/mumbai">Mumbai</NavLin></ListItem>
              <ListItem><NavLin href="/transport/west-bengal">West Bengal</NavLin></ListItem>
              <ListItem><NavLin href="/transport/all-india">All India</NavLin></ListItem>
            </List>
          </Column>

          <Column>
            <Title>Quick Links</Title>
            <List>
              <ListItem><NavLin href="/">Home</NavLin></ListItem>
              <ListItem><NavLin href="/about">About Us</NavLin></ListItem>
              <ListItem><NavLin href="/services">Services</NavLin></ListItem>
              <ListItem><NavLin href="/clients">Clients</NavLin></ListItem>
              <ListItem><NavLin href="/gallery">Gallery</NavLin></ListItem>
              <ListItem><NavLin href="/contact">Contact Us</NavLin></ListItem>
              <ListItem><NavLin href="/branch-locator">Branch Locator</NavLin></ListItem>
            </List>
          </Column>

          <Column>
            <Title>Contact Info</Title>
            <ContactText>
              <i className="fas fa-map-marker-alt"></i>
              <span>
                <strong>Head Office</strong><br />
                DriveOnRyd, India
              </span>
            </ContactText>
            <ContactText>
              <i className="fas fa-phone"></i>
              <span>
                <strong>Phone Support</strong><br />
                +91 11 49090585 / 86 / 87 / 88
              </span>
            </ContactText>
            <ContactText>
              <i className="fas fa-envelope"></i>
              <span>
                <strong>Email Us</strong><br />
                <ContactLink href="mailto:info@greatwaygroup.com">info@greatwaygroup.com</ContactLink>
              </span>
            </ContactText>
          </Column>
        </Grid>

        <BottomBar>
          <Copyright>
            &copy; {new Date().getFullYear()} DriveOnRyd. All Rights Reserved.
          </Copyright>
          <ScrollUp href="#" onClick={scrollToTop}>
            Back to top <i className="fas fa-arrow-up"></i>
          </ScrollUp>
        </BottomBar>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;

