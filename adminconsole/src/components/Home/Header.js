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
  margin-left: auto;
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
                <Nav className="me-auto" style={{ paddingLeft: '90%' }}>
                

                  


                  <NavLink to="/login">LOGIN</NavLink>
                </Nav>
              </Navbar.Collapse>
            </>
          </Container>
        </Navbar>
      </div>
     
    </>
  );
};

export default Header;

// rgba(38,60,90,255)
// rgba(16,26,37,255)
