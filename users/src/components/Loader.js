import React from 'react';
// import { Triangle } from 'react-loader-spinner';
import { ClimbingBoxLoader } from 'react-spinners';
import styled from 'styled-components';

// const TRIANGLE = styled(Triangle)`
//   margin: 10%;
// `;
const Loader = () => {
  return (
    <div>
      {/* <TRIANGLE
        height="80"
        width="80"
        margin="10%"
        color="#4fa94d"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      /> */}
      <ClimbingBoxLoader color="#36d7b7" />
    </div>
  );
};

export default Loader;
