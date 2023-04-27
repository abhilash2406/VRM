import React, { useEffect, useState } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDrivers } from './action';

const DriverList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDrivers());
  }, []);

  const { driverData } = useSelector((e) => e.driver);
  console.log('driverData', driverData);
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <Link to="/add-drivers">
            <button className="btn btn-info add-btn">Add driver</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DriverList;
