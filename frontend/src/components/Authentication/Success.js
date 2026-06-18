import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  min-height: 80vh;
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-bottom: 0.5rem;
    color: #029e02;
  }
`;

const Success = () => {
  return (
    <Container>
      <h2>Registered successfully</h2>
    
      <Link to={'/login'}>Back to </Link>
    </Container>
  );
};

export default Success;
