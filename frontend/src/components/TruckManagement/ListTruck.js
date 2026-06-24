import logger from '../../utils/logger';
import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTruckData, dltTruck } from './action';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';

const ListTruck = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllTruckData());
  }, []);

  const { truckData } = useSelector((e) => e.truck);

  createTheme(
    'solarized',
    {
      text: {
        primary: 'yellow',
        secondary: 'white',
      },
      background: {
        default: '#002b36',
      },
      context: {
        background: '#cb4b16',
        text: '#FFFFFF',
      },
      divider: {
        default: '#073642',
      },
      action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
      },
    },
    'dark'
  );
  const userRole = JSON.parse(localStorage.getItem('currentUser')).designation;
  const { grantedPermissions } = useSelector((state) => state.auth);
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
          {userRole === 'Admin'|| permissionAllowed?.includes('Edit') ? (
            <Link className="btn btn-info" to={`/edit-trucks/${row.id}`}>
              Edit
            </Link>
          ) : null}
          {userRole === 'Admin'|| permissionAllowed?.includes('Delete') ? (
            <button
              className="btn btn-warning"
              onClick={() => {
                dispatch(dltTruck(row.id));
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
      title="No Trucks Found" 
      description="There are currently no trucks available to display." 
      icon="bi-inbox" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Trucks Management</h1>
            <p className="dashboard-subtitle">Manage all registered trucks in the system.</p>
          </div>
          { (userRole === 'Admin' || permissionAllowed?.includes('Add')) && (
            <Link to="/add-trucks">
              <button className="btn btn-info px-4 py-2" style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold' }}>
                <i className="bi-plus-lg me-2"></i> Add Truck
              </button>
            </Link>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={truckData}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
          />
        </div>
      </div>
    </div>
  );
};

export default ListTruck;
