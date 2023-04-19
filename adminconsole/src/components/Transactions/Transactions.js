import React from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';

const Transactions = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100"></div>
      </div>
    </div>
  );
};

export default Transactions;
