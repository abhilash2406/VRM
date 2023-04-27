import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Testimonial from './Testimonial';
import Carousel from 'react-bootstrap/Carousel';
const HomePage = () => {
  return (
    <div>
      <Header />

      <Carousel className="crd">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://s3-ap-northeast-1.amazonaws.com/wp-gogovan.com/wp-content/uploads/sites/5/2021/03/26094714/IN_vehicle_type_1280x760.jpg"
            alt="First slide"
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://s3-ap-northeast-1.amazonaws.com/wp-gogovan.com/wp-content/uploads/sites/5/2021/04/19093628/from-this-to-this-1.jpg"
            alt="Second slide"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://s3-ap-northeast-1.amazonaws.com/wp-gogovan.com/wp-content/uploads/sites/5/2021/01/20090151/GOGOX-Logistics-2048x1320.jpg"
            alt="Third slide"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Testimonial />
      <Footer />
    </div>
  );
};

export default HomePage;
