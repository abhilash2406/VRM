import React from 'react';

const Footer = () => {
  return (
    <footer className=" text-white text-center text-lg-start footerBg">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase text-dark">Footer Content</h5>

            <p className="text-black">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste
              atque ea quis molestias. Fugiat pariatur maxime quis culpa
              corporis vitae repudiandae aliquam voluptatem veniam, est atque
              cumque eum delectus sint!
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase  text-dark mb-0">Links</h5>

            <ul className="list-unstyled">
              <li>
                <a href="#!" className="text-white text-decoration-none">
                  Events
                </a>
              </li>
              <li>
                <a href="#!" className="text-white text-decoration-none">
                  Venues
                </a>
              </li>
              <li>
                <a href="#!" className="text-white text-decoration-none">
                  Companies
                </a>
              </li>
              <li>
                <a href="#!" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="text-center p-3"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
      >
        © 2023 Copyright:
        <a
          className="text-white text-decoration-none"
          href="https://mdbootstrap.com/"
        >
          ticketRhino.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
