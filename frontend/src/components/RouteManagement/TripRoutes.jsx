import React, { useEffect } from 'react';
import NavBar from '../Shared/NavBar';
import { Link } from 'react-router-dom';
import { useAllRoutes, useDeleteRoute } from '../../hooks/queries/useRouteQueries';
import { useAuthStore } from '../../store/useAuthStore';
import AppDataTable from '../Shared/AppDataTable';
import NotFound from '../NotFound';

const TripRoutes = () => {
  const { data: routeData } = useAllRoutes();
  const { mutate: deleteRoute } = useDeleteRoute();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;
  const { grantedPermissions } = useAuthStore();

  let array = grantedPermissions?.filter((item) => item.menu === 'Route');
  let permissionAllowed = array?.map((e) => e.subMenu);

  const columns = [
    { name: 'From', selector: (row) => row.from || 'N/A' },
    { name: 'To', selector: (row) => row.to || 'N/A' },
    { name: 'State', selector: (row) => row.state || 'N/A' },
    { name: 'Country', selector: (row) => row.country || 'N/A' },
    {
      name: 'Action',
      minWidth: '200px',
      omit: !(userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Edit') || permissionAllowed?.includes('Delete')),
      selector: (row) => (
        <div>
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Edit')) && (
            <Link className="btn btn-info btn-sm me-2" to={`/edit-routes/${row.id}`}>
              Edit
            </Link>
          )}
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Delete')) && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteRoute(row.id)}
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
      title="No Routes Found" 
      description="There are currently no routes available to display." 
      icon="bi-signpost-split" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Routes Management</h1>
            <p className="dashboard-subtitle">Manage start and end points for all trips.</p>
          </div>
          { (userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Add')) && (
            <Link to="/add-routes">
              <button className="btn btn-info px-4 py-2" style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold' }}>
                <i className="bi-plus-lg me-2"></i> Add Route
              </button>
            </Link>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <AppDataTable
            columns={columns}
            data={routeData || []}

            noDataComponent={customNoData}
          />
        </div>
      </div>
    </div>
  );
};

export default TripRoutes;
