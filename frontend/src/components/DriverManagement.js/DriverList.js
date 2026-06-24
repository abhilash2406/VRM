import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDrivers, dltDriver } from './action';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';

const DriverList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDrivers());
  }, [dispatch]);

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;
  const { grantedPermissions } = useSelector((state) => state.auth);
  let array = grantedPermissions?.filter((item) => item.menu === 'Driver');
  let permissionAllowed = array?.map((e) => e.subMenu);

  const { driverData } = useSelector((e) => e.driver);

  createTheme(
    'solarized',
    {
      text: { primary: '#f8fafc', secondary: '#94a3b8' },
      background: { default: 'transparent' },
      context: { background: '#cb4b16', text: '#FFFFFF' },
      divider: { default: 'rgba(255, 255, 255, 0.1)' },
      action: { button: 'rgba(255,255,255,.54)', hover: 'rgba(255,255,255,.08)', disabled: 'rgba(255,255,255,.12)' },
    },
    'dark'
  );

  const columns = [
    {
      name: 'Photo',
      selector: (row) => (
        <img
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', margin: '5px 0' }}
          src={`${process.env.REACT_APP_BACKEND_URL}/${row.userPhoto}`}
          alt="Driver"
        />
      ),
    },
    { name: 'Name', selector: (row) => row.user?.name || 'N/A' },
    { name: 'Phone', selector: (row) => row.user?.phoneNumber || 'N/A' },
    { name: 'Email', selector: (row) => row.user?.login?.email || 'N/A' },
    { name: 'Status', selector: (row) => row.status || 'N/A' },
    {
      name: 'Action',
      minWidth: '250px',
      selector: (row) => (
        <div>
          <Link className="btn btn-primary btn-sm me-2" to={`/view-data/${row.id}`}>
            View
          </Link>
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Edit')) && (
            row.status === 'approved' ? (
              <Link className="btn btn-info btn-sm me-2" to={`/edit-driver/${row.id}`}>
                Edit
              </Link>
            ) : <span className="text-warning small me-2">Approve First</span>
          )}
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Delete')) && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => dispatch(dltDriver(row.id))}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Drivers Found" 
      description="There are currently no drivers available to display." 
      icon="bi-people" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Drivers Management</h1>
            <p className="dashboard-subtitle">Manage all registered drivers in the system.</p>
          </div>
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Add')) && (
            <Link to="/add-drivers">
              <button className="btn btn-info px-4 py-2" style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold' }}>
                <i className="bi-plus-lg me-2"></i> Add Driver
              </button>
            </Link>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={driverData || []}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverList;
