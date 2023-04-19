import React from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';

const TripRoutes = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <Link to="/add-routes">
            <button className="btn btn-dark add-btn">Add Routes</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripRoutes;
