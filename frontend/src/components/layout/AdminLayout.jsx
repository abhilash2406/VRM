import React from 'react';
import NavBar from '../Shared/NavBar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
