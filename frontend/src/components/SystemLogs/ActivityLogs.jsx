import React, { useState } from 'react';
import NavBar from '../Shared/NavBar';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';
import { exportToCSV } from '../../utils/exportUtils';
import TablePanelHeader from '../Shared/TablePanelHeader';

const mockLogs = [
  { id: 1, action: "User Login", user: "Admin", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), details: "Logged in successfully from IP 192.168.1.5" },
  { id: 2, action: "Added Vehicle", user: "Manager 1", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), details: "Added new truck VIN #123456789" },
  { id: 3, action: "Updated Trip", user: "Manager 2", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), details: "Changed status of Trip #1024 to 'Completed'" },
  { id: 4, action: "User Logout", user: "Admin", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), details: "Logged out" },
  { id: 5, action: "Deleted Driver", user: "SUPERADMIN", timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), details: "Removed driver ID 45" },
];

const ActivityLogs = () => {
  const [logs] = useState(mockLogs);

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
    { name: 'Timestamp', selector: (row) => new Date(row.timestamp).toLocaleString(), sortable: true, width: '200px' },
    { name: 'User', selector: (row) => row.user, sortable: true, width: '150px' },
    { name: 'Action', selector: (row) => row.action, sortable: true, width: '200px' },
    { name: 'Details', selector: (row) => row.details, wrap: true },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Logs Found" 
      description="There are currently no activity logs available." 
      icon="bi-shield-lock" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">System Activity Logs</h1>
            <p className="dashboard-subtitle">Monitor administrative actions and system events.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <TablePanelHeader 
            searchPlaceholder="Search logs..."
            onExport={() => exportToCSV(logs, 'ActivityLogs')}
          />
          <DataTable
            columns={columns}
            data={logs}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
            defaultSortFieldId={1}
            defaultSortAsc={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
