import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddTrips from './AddTrips';
import { useAllTrips, useDeleteTrip } from '../../../hooks/queries/useTripQueries';
import { useAuthStore } from '../../../store/useAuthStore';
import AppDataTable from '../../../components/Shared/AppDataTable';
import NotFound from '../../../components/NotFound';
import { exportToCSV } from '../../../utils/exportUtils';
import TablePanelHeader from '../../../components/Shared/TablePanelHeader';

const Trips = () => {
  const { data: trips } = useAllTrips();
  const { mutate: deleteTrip } = useDeleteTrip();
  const [selectedTripId, setSelectedTripId] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;
  const { grantedPermissions } = useAuthStore();

  let array = grantedPermissions?.filter((item) => item.menu === 'Trip');
  let permissionAllowed = array?.map((e) => e.subMenu);

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
            <button
              className="btn btn-info btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#addTripModal"
              onClick={() => setSelectedTripId(row.id)}
            >
              Edit
            </button>
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
    <>
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
            onAddClick={() => setSelectedTripId(null)}
            addModalTarget="#addTripModal"
          />
          <AppDataTable
            columns={columns}
            data={trips || []}

            noDataComponent={customNoData}
          />
        </div>

        {/* Modal Component */}
        <AddTrips id={selectedTripId} onClose={() => setSelectedTripId(null)} />
    </>
  );
};

export default Trips;
