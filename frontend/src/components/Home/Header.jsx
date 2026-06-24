import React from 'react';

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
  font-family: 'Orbitron', sans-serif;
  text-decoration: none;
  color: white;
  font-size: larger;
  font-weight: 800;
  &:hover {
    color: #00D4FF;
  }
`;

const Header = () => {
  return (
    <>
      <div className="navigationbar">
        <Navbar expand="lg">
          <Container>
            <Navbar.Brand>
              <img src="/logo.png" alt="DriveOnRyd Logo" style={{ width: '36px', height: '36px', marginBottom: '4px' }} />
              <Logo to="/">DriveOnRyd</Logo>
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
