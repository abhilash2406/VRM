import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppDataTable from '../../../components/Shared/AppDataTable';
import NotFound from '../../../components/NotFound';
import { exportToCSV } from '../../../utils/exportUtils';
import TablePanelHeader from '../../../components/Shared/TablePanelHeader';


const AddUser = () => {
  const navigate = useNavigate();
  // Dummy data array since we are focusing on frontend layout.
  // Once backend is ready, replace this with the actual users list from Redux state.
  const usersList = []; 
  const columns = [
    { name: 'Name', selector: (row) => row.name || 'N/A' },
    { name: 'Email', selector: (row) => row.email || 'N/A' },
    { name: 'Phone', selector: (row) => row.phoneNumber || 'N/A' },
    { name: 'Designation', selector: (row) => row.designation?.designation || 'N/A' },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Users Found" 
      description="There are currently no users available to display." 
      icon="bi-people" 
    />
  );

  return (
    <>
      <div className="dashboard-header mb-4">
        <div>
            <h1 className="dashboard-title">Users Management</h1>
            <p className="dashboard-subtitle">Manage all registered users in the system.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <TablePanelHeader 
            searchPlaceholder="Search users..."
            onExport={() => exportToCSV(usersList, 'Users')}
            showAddButton={false}
          />
          <AppDataTable
            columns={columns}
            data={usersList}

            noDataComponent={customNoData}
          />
        </div>

    </>
  );
};

export default AddUser;
