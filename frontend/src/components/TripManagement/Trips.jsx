import React, { useEffect } from 'react';
import NavBar from '../Shared/NavBar';
import { Link } from 'react-router-dom';
import { useAllTrips, useDeleteTrip } from '../../hooks/queries/useTripQueries';
import { useAuthStore } from '../../store/useAuthStore';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';
import { exportToCSV } from '../../utils/exportUtils';
import TablePanelHeader from '../Shared/TablePanelHeader';

const Trips = () => {
  const { data: trips } = useAllTrips();
  const { mutate: deleteTrip } = useDeleteTrip();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;
  const { grantedPermissions } = useAuthStore();

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
              onClick={() => deleteTrip(row.id)}
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
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <TablePanelHeader 
            searchPlaceholder="Search journeys..."
            onExport={() => exportToCSV(trips, 'Journeys')}
            showAddButton={userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Add')}
            addButtonText="Add Journey"
            addButtonLink="/add-trips"
          />
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
