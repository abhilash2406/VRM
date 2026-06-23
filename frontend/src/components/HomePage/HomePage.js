import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Testimonial from './Testimonial';
import Services from './Services';
import Carousel from 'react-bootstrap/Carousel';
import styled, { keyframes } from 'styled-components';

/* ── animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── carousel wrapper ── */
const CarouselWrapper = styled.div`
  position: relative;
  overflow: hidden;

  .carousel-item {
    position: relative;
  }

  /* AI-generated images are square — show the top half (most scenic) */
  .slide-img {
    width: 100%;
    height: 90vh;
    min-height: 520px;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: brightness(0.48);
  }

  /* slide 2 (night truck) — centre is better */
  .slide-img.center {
    object-position: center center;
  }

  /* override Bootstrap .carousel-caption: full-bleed flex */
  .carousel-caption {
    position: absolute !important;
    inset: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    text-align: center !important;
  }

  /* prev / next circles */
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    width: 50px;
    height: 50px;
    background-color: rgba(59, 130, 246, 0.4);
    border-radius: 50%;
    background-size: 45%;
    backdrop-filter: blur(6px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: background-color 0.3s;
  }
  .carousel-control-prev:hover .carousel-control-prev-icon,
  .carousel-control-next:hover .carousel-control-next-icon {
    background-color: rgba(59, 130, 246, 0.75);
  }

  /* dot indicators */
  .carousel-indicators {
    bottom: 28px;
    margin-bottom: 0;
  }
  .carousel-indicators [data-bs-target] {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.35);
    border: none;
    margin: 0 5px;
    transition: all 0.3s;
  }
  .carousel-indicators .active {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transform: scale(1.4);
  }
`;

/* ── text overlay ── */
const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 860px;
  padding: 0 32px;
  animation: ${fadeUp} 0.85s ease both;
  z-index: 5;
`;

const Tag = styled.span`
  display: inline-block;
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.55);
  color: #93c5fd;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 7px 24px;
  border-radius: 50px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: clamp(2.2rem, 5.5vw, 4.2rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 18px;
  text-shadow: 0 4px 32px rgba(0, 0, 0, 0.8);

  span {
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Desc = styled.p`
  font-size: 1.1rem;
  color: #e2e8f0;
  max-width: 600px;
  margin: 0 auto 36px;
  line-height: 1.75;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
`;

const Btn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 50px;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
  transition: all 0.3s ease;
  letter-spacing: 0.3px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 45px rgba(59, 130, 246, 0.7);
    color: #ffffff;
  }
`;

/* ── slide data — all AI-generated, saved locally ── */
const slides = [
  {
    img: '/hero1.png',
    imgClass: 'slide-img',
    tag: 'Two-Wheelers · Cars · Buses · Trucks',
    title: <>Rent Any Vehicle, <span>Anywhere in India</span></>,
    desc: 'From scooters to luxury cars to full-size buses — choose your ride and book instantly at the best rates.',
  },
  {
    img: '/hero2.png',
    imgClass: 'slide-img center',
    tag: 'Professional Driver Service',
    title: <>Hire a Trusted <span>Driver On Demand</span></>,
    desc: 'Experienced, verified drivers available 24/7 — whether for a daily commute, outstation trip, or corporate travel.',
  },
  {
    img: '/hero3.png',
    imgClass: 'slide-img center',
    tag: 'Flexible · Affordable · Reliable',
    title: <>Your Journey, <span>Your Way</span></>,
    desc: 'Hourly, daily or monthly rentals across all vehicle categories. Transparent pricing, zero hidden charges.',
  },
];

/* ── page component ── */
const HomePage = () => {
  return (
    <div>
      <Header />

      <CarouselWrapper>
        <Carousel interval={5000} fade>
          {slides.map((slide, i) => (
            <Carousel.Item key={i}>
              <img
                className={slide.imgClass}
                src={slide.img}
                alt={`Slide ${i + 1}`}
              />
              {/* centered overlay using Bootstrap .carousel-caption overridden to flex */}
              <div className="carousel-caption">
                <Overlay>
                  <Tag>{slide.tag}</Tag>
                  <Title>{slide.title}</Title>
                  <Desc>{slide.desc}</Desc>
                  <Btn href="/services">
                    Explore Services&nbsp;<i className="fas fa-arrow-right" />
                  </Btn>
                </Overlay>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </CarouselWrapper>

      <Testimonial />
      <Services />
      <Footer />
    </div>
  );
};

export default HomePage;
