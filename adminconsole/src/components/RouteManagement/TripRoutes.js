//trip list

import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRoutes, dltRoute } from './action';
import DataTable, { createTheme } from 'react-data-table-component';
import { includes } from 'lodash';

const TripRoutes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRoutes());
  }, []);
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

  const { routeData } = useSelector((e) => e.routes);
  console.log(routeData);
  const { grantedPermissions } = useSelector((state) => state.auth);

  let array = grantedPermissions?.filter((item) => item.menu === 'Route');

  let permissionAllowed = array?.map((e) => e.subMenu);
  const columns = [
    {
      name: 'From',
      selector: (row) => row.from,
    },

    {
      name: 'To',
      selector: (row) => row.to,
    },
    {
      name: 'State',
      selector: (row) => row.state,
    },
    {
      name: 'Country',
      selector: (row) => row.country,
    },

    {
      name: 'Action',
      omit: permissionAllowed?.includes('Delete') ? false : true,
      selector: (row) => (
        <div>
          <button
            className="btn btn-danger"
            onClick={() => {
              dispatch(dltRoute(row.id));
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          {permissionAllowed?.includes('Add') ? (
            <Link to="/add-routes">
              <button className="btn btn-info add-btn">Add Routes</button>
            </Link>
          ) : null}
          <div className="mt-5">
            <DataTable
              columns={columns}
              pagination
              theme="solarized"
              data={routeData ? routeData : []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripRoutes;
