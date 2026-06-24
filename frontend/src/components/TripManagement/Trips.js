import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTrips, dltTrip } from './index';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';

const Trips = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);

  const { trips } = useSelector((e) => e.routes);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;
  const { grantedPermissions } = useSelector((state) => state.auth);

  let array = grantedPermissions?.filter((item) => item.menu === 'Trip');
  let permissionAllowed = array?.map((e) => e.subMenu);

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
    { name: 'Driver', selector: (row) => row.driver?.user?.name || 'N/A' },
    { name: 'From', selector: (row) => row.route?.from || 'N/A' },
    { name: 'To', selector: (row) => row.route?.to || 'N/A' },
    { name: 'Truck', selector: (row) => row.truck?.brand || 'N/A' },
    { name: 'Status', selector: (row) => row.status || 'N/A' },
    { name: 'Date of Trip', selector: (row) => new Date(row.date).toISOString().substring(0, 10) },
    {
      name: 'Action',
      selector: (row) => (
        <div>
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Edit')) && (
            <Link className="btn btn-info btn-sm me-2" to={`/edit-trips/${row.id}`}>
              Edit
            </Link>
          )}
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Delete')) && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => dispatch(dltTrip(row.id))}
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
      title="No Journeys Found" 
      description="There are currently no journeys available to display." 
      icon="bi-map" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Journeys Management</h1>
            <p className="dashboard-subtitle">Manage all vehicle journeys in the system.</p>
          </div>
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Add')) && (
            <Link to="/add-trips">
              <button className="btn btn-info px-4 py-2" style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold' }}>
                <i className="bi-plus-lg me-2"></i> Add Journey
              </button>
            </Link>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={trips || []}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
          />
        </div>
      </div>
    </div>
  );
};

export default Trips;
