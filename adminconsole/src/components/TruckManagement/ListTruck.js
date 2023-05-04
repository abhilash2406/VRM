import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTruckData, dltTruck } from './action';
import DataTable, { createTheme } from 'react-data-table-component';

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
  const { grantedPermissions } = useSelector((state) => state.auth);
  // console.log('grantedPermissions', grantedPermissions);
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
          src={`http://localhost:5000/${row.truckPhoto}`}
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
          {permissionAllowed?.includes('Edit') ? (
            <Link className="btn btn-info" to={`/edit-trucks/${row.id}`}>
              Edit
            </Link>
          ) : null}
          {permissionAllowed?.includes('Delete') ? (
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

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <div className="mb-3">
            {permissionAllowed?.includes('Add') ? (
              <Link to="/add-trucks">
                <button className="btn btn-info add-btn">Add Truck</button>
              </Link>
            ) : null}
          </div>

          <DataTable
            columns={columns}
            data={truckData}
            pagination
            theme="solarized"
          />
        </div>
      </div>
    </div>
  );
};

export default ListTruck;
