import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Testimonial from './Testimonial';
import Carousel from 'react-bootstrap/Carousel';
const HomePage = () => {
  return (
    <div>
      <Header />

      <Carousel className='crd'>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://greatwaygroup.com/img/slider/slide.jpg"
            alt="First slide"
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://greatwaygroup.com/img/slider/slide03.jpg"
            alt="Second slide"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://greatwaygroup.com/img/slider/slide04.jpg"
            alt="Third slide"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Testimonial/>
      <Footer />
    </div>
  );
};

export default HomePage;
