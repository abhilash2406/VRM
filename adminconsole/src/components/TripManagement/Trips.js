import React from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';

const Trips = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <Link to="/add-trips">
            <button className="btn btn-info add-btn">Add trip</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Trips;
