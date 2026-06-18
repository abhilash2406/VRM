import React from 'react';
import styled from 'styled-components';

const NavLin = styled.a`
  color: black;
  text-decoration: none;
  margin-left: 30px;
  &:hover {
    color: red;
    text-decoration: none;
    border-bottom: 3px solid #cb3066;
  }
`;

const Footer = () => {
  return (
    <div id="footer-wrapper" className="footerBg">
      <footer id="footer">
        <div className="container">
          <div className="row">
            <ul className="col-md-3 col-sm-6 footer-widget-container">
              <li className="widget widget_pages">
                <div className="title">
                  <h3> Transportation</h3>
                </div>

                <ul>
                  <li>
                    <NavLin href="teatransportuttarpradesh.html">
                      Tea Transportation-North India
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="teatransportsouthindia.html">
                      Tea Transportation-South India
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="teatransportassam.html">
                      Tea Transportation-Assam
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="teatransportharyana.html">
                      Tea Transportation-Haryana
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="teatransportpunjab.html">
                      Tea Transportation-Punjab
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="teatransportmaharashtra.html">
                      Tea Transportation-Mumbai
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="teatransportwestbengal.html">
                      Tea Transportation-West Bengal
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="teatransportrajasthan.html">
                      Tea Transportation-India
                    </NavLin>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="col-md-3 col-sm-6 footer-widget-container">
              <li className="widget widget_pages">
                <div className="title">
                  <h3>quick links</h3>
                </div>

                <ul>
                  <li>
                    <NavLin href="index.html">Home</NavLin>
                  </li>
                  <li>
                    <NavLin href="aboutus.html">About</NavLin>
                  </li>
                  <li>
                    <NavLin href="services.html">Services</NavLin>
                  </li>
                  <li>
                    <NavLin href="clients.html">Clients</NavLin>
                  </li>
                  <li>
                    <NavLin href="gallery.html">Gallery</NavLin>
                  </li>
                  <li>
                    <NavLin href="contactus.html">Contact Us</NavLin>
                  </li>
                  <li>
                    <NavLin href="find_branch.html">Branch Locator</NavLin>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="col-md-3 col-sm-6 footer-widget-container">
              <li className="widget widget_pages">
                <div className="title">
                  <h3>Services</h3>
                </div>

                <ul>
                  <li>
                    <NavLin href="teatransport.html">Tea Transportation</NavLin>
                  </li>{' '}
                  <li>
                    <NavLin href="domesticfreight.html">
                      Domestic Freight Service
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="packersnmovers.html">
                      Packers &amp; Movers
                    </NavLin>
                  </li>
                  <li>
                    <NavLin href="insurance.html">Insurance Service</NavLin>
                  </li>
                  <li>
                    <NavLin href="fulltruckload.html">Full Truck Load</NavLin>
                  </li>
                  <li>
                    <NavLin href="warehousing.html">Warehousing</NavLin>
                  </li>
                  <li>
                    <NavLin href="logistics.html">Logistics</NavLin>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="col-md-3 col-sm-6 footer-widget-container">
              <li className="widget widget-text">
                <div className="title">
                  <h3>contact us</h3>
                </div>

                <span className="text-big">+91 11 49090585/86/87/88</span>
                <br />

                <a href="mailto:">info@greatwaygroup.com</a>
                <br />
                <ul className="footer-social-icons">
                  <li>
                    <a
                      href="https://www.facebook.com/greatwaygroup"
                      target="_blank"
                      className="fa fa-facebook"
                    ></a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com/greatway"
                      target="_blank"
                      className="fa fa-twitter"
                    ></a>
                  </li>
                  <li>
                    <a
                      href="https://plus.google.com/114978467283251175746"
                      target="_blank"
                      className="fa fa-google-plus"
                    ></a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="copyright-container">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>Greatway Group 2016. All RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </div>
      <a href="#" className="scroll-up" style={{ display: 'inline' }}>
        Scroll
      </a>
    </div>
  );
};

export default Footer;
