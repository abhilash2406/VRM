import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">dash board</div>
      </div>
    </div>
  );
};

export default Dashboard;
