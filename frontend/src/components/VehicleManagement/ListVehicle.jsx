import logger from '../../utils/logger';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import NavBar from '../Shared/NavBar';
import { Link } from 'react-router-dom';
import { useAllTrucks, useDeleteTruck } from '../../hooks/queries/useTruckQueries';
import { useAuthStore } from '../../store/useAuthStore';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';
import { exportToCSV } from '../../utils/exportUtils';
import TablePanelHeader from '../Shared/TablePanelHeader';
import AddVehicleModal from './AddVehicleModal';

const ListTruck = () => {
  const { data: truckData } = useAllTrucks();
  const { mutate: deleteTruck } = useDeleteTruck();
  const modalRef = useRef(null);

  const openAddModal = () => {
    const el = document.getElementById('addVehicleModal');
    if (el && window.bootstrap) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    }
  };

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
  const userRole = JSON.parse(localStorage.getItem('currentUser')).designation;
  const { grantedPermissions } = useAuthStore();
  // logger.info('grantedPermissions', grantedPermissions);
  let array = grantedPermissions?.filter((item) => item.menu === 'Truck');
  let permissionAllowed = array?.map((e) => e.subMenu);
  const columns = [
    {
      name: 'brand',
      selector: (row) => row.brand,
    },
    {
      name: 'model',
      selector: (row) => row.model,
    },
    {
      name: 'VIN',
      selector: (row) => row.VIN,
    },
    {
      name: 'truck photo',
      selector: (row) => (
        <img
          style={{ width: '50%' }}
          src={`${process.env.REACT_APP_BACKEND_URL}/${row.truckPhoto}`}
          alt=""
        ></img>
      ),
    },
    {
      name: 'year of manufacturing',
      selector: (row) => row.yrManufacture,
    },

    {
      name: 'ACTION',
      selector: (row) => (
        <div>
          {' '}
          {userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Edit') ? (
            <Link className="btn btn-info" to={`/update-vehicle/${row.id}`}>
              Edit
            </Link>
          ) : null}
          {userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Delete') ? (
            <button
              className="btn btn-warning"
              onClick={() => {
                deleteTruck(row.id);
              }}
              style={{ marginLeft: '5px' }}
            >
              delete
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Vehicles Found" 
      description="There are currently no vehicles available to display." 
      icon="bi-inbox" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Vehicles</h1>
            <p className="dashboard-subtitle">Manage all registered vehicles in the system.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <TablePanelHeader 
            searchPlaceholder="Search vehicles..."
            onExport={() => exportToCSV(truckData, 'Vehicles')}
            showAddButton={userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Add')}
            addButtonText="Add"
            onAddClick={openAddModal}
          />
          <DataTable
            columns={columns}
            data={truckData}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
          />
        </div>
      </div>
      {ReactDOM.createPortal(<AddVehicleModal />, document.body)}
    </div>
  );
};

export default ListTruck;
