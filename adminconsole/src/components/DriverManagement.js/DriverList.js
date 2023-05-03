//driver list

import React, { useEffect, useState } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDrivers, dltDriver } from './action';

const DriverList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDrivers());
  }, []);

  const { grantedPermissions } = useSelector((state) => state.auth);
  let array = grantedPermissions?.filter((item) => item.menu === 'Driver');
  let permissionAllowed = array?.map((e) => e.subMenu);

  const { driverData } = useSelector((e) => e.driver);
  console.log('driverData', driverData);

  const tableData = driverData?.map((data, index) => {
    return (
      <tr>
        <td>
          {' '}
          <img
            style={{ width: '80px' }}
            className="card-img-top"
            src={`http://localhost:5000/${data.userPhoto}`}
            alt="Card imag cap"
          />
        </td>
        <td>{data?.user?.name}</td>
        <td>{data?.user?.phoneNumber}</td>
        <td>{data?.user?.login?.email}</td>
        <td>{data?.status}</td>

        <td>
          <Link className="btn btn-info" to={`/view-data/${data.id}`}>
            view
          </Link>
        </td>
        <td>
            <button
            className="btn btn-danger"
            onClick={() => {
              dispatch(dltDriver(data.id));
            }}
          >
            Delete
          </button>
          </td>
      </tr>
    );
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          {permissionAllowed?.includes('Add') ? (
            <Link to="/add-drivers">
              <button className="btn btn-info add-btn">Add driver</button>
            </Link>
          ) : null}
          <div className="d-flex justify-content-around">
            {' '}
            <table class="table table-dark mt-5">
              <thead>
                <tr>
                  <th scope="col">photo</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">email</th>
                  <th scope="col">status</th>
                  <th scope="col">view</th>
                  <th scope="col">delete</th>
                  
                </tr>
              </thead>
              <tbody>{tableData}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverList;
