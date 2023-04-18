import React from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';

const ListTruck = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <Link to="/add-trucks">
            <button className="btn btn-dark add-btn">Add Truck</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListTruck;
