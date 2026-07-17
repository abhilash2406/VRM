import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Testimonial from './Testimonial';
import Services from './Services';
import PremiumHero from './PremiumHero';
import styled, { keyframes } from 'styled-components';



/* ── page component ── */
const HomePage = () => {
  return (
    <div>
      <Header />
      <PremiumHero />

      <Testimonial />
      <Services />
      <Footer />
    </div>
  );
};

export default HomePage;
