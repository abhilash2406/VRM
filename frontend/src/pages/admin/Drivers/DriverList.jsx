import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAllDrivers, useDeleteDriver } from '../../../hooks/queries/useDriverQueries';
import { useAuthStore } from '../../../store/useAuthStore';
import AppDataTable from '../../../components/Shared/AppDataTable';
import NotFound from '../../../components/NotFound';
import { exportToCSV } from '../../../utils/exportUtils';
import TablePanelHeader from '../../../components/Shared/TablePanelHeader';

const DriverList = () => {
  const { data: driverData } = useAllDrivers();
  const { mutate: deleteDriver } = useDeleteDriver();

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;
  const { grantedPermissions } = useAuthStore();
  let array = grantedPermissions?.filter((item) => item.menu === 'Driver');
  let permissionAllowed = array?.map((e) => e.subMenu);

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
              onClick={() => deleteDriver(row.id)}
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
    <>
      <div className="dashboard-header mb-4">
        <div>
            <h1 className="dashboard-title">Drivers Management</h1>
            <p className="dashboard-subtitle">Manage all registered drivers in the system.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <TablePanelHeader 
            searchPlaceholder="Search drivers..."
            onExport={() => exportToCSV(driverData, 'Drivers')}
            showAddButton={userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Add')}
            addButtonText="Add Driver"
            addButtonLink="/add-drivers"
          />
          <AppDataTable
            columns={columns}
            data={driverData || []}

            noDataComponent={customNoData}
          />
        </div>
    </>
  );
};

export default DriverList;
