import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Testimonial from './Testimonial';
import Services from './Services';
import PremiumHero from './PremiumHero';
import Blog from './Blog';
import styled, { keyframes } from 'styled-components';

const PageWrapper = styled.div`
  background: linear-gradient(180deg, #050a33 0%, #05081f 50%, #071229 100%);
  min-height: 100vh;
`;

/* ── page component ── */
const HomePage = () => {
  return (
    <PageWrapper>
      <Header />
      <PremiumHero />

      <Testimonial />
      <Services />
      <Blog />
      <Footer />
    </PageWrapper>
  );
};

export default HomePage;
