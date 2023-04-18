import React from 'react';
// import { useDispatch } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

// styled components
const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-left: 30px;
  font-size: 20px;
  &:hover {
    color: red;
    text-decoration: none;
    border-bottom: 3px solid #cb3066;
  }
`;
const NavTag = styled.a`
  color: white;
  text-decoration: none;
  margin-left: 30px;
  font-size: 20px;
  &:hover {
    color: red;
    text-decoration: none;
    border-bottom: 3px solid #cb3066;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: larger;
  font-weight: 800;
  &:hover {
    color: black;
  }
`;

const Header = () => {
  return (
    <>
      <div className="navigationbar">
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand>
              <img
                src={require('../../images/icons8-truck-50.png')}
                style={{ marginBottom: '20px' }}
              />
              <Logo to="/">TRUCKS</Logo>
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="text-white bg-white"
            />

            <>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/gallery">Gallery</NavLink>
                  <NavLink to="/contact-us">Contact Us</NavLink>
                  <NavTag href="http://localhost:3001/login">LOGIN/Register</NavTag>
                </Nav>
              </Navbar.Collapse>
            </>
          </Container>
        </Navbar>
      </div>
      <div className="row justify-content-center ">
        <div className="col-12 col-md-10 col-lg-8">
          <form className="card1 card-sm border-0">
            <div className="card-body row no-gutters align-items-center py-0">
              <div className="col-auto">
                <i className="fas fa-search h4 text-body"></i>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Header;

// rgba(38,60,90,255)
// rgba(16,26,37,255)
