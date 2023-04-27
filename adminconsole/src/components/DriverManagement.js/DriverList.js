import React, { useEffect, useState } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDrivers, dltDriver } from './action';
import Card from 'react-bootstrap/Card';

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

  const Data = driverData.map((data, index) => {
    return (
      <div className="card border-0" style={{ width: '18rem' }} key={index}>
        <img
          className="card-img-top"
          src={`http://localhost:5000/${data.userPhoto}`}
          alt="Card imag cap"
        />
        <div className="card-body ">
          <h3 className="card-title font-weight-bold">{data.user.name}</h3>
          <label>phone number-</label>{' '}
          <Card.Text>{data.user.phoneNumber}</Card.Text>
          <label>shift time-</label> <Card.Text>{data.shift}</Card.Text>
          <label>Time-</label> <Card.Text>{data.user.login.email}</Card.Text>
        </div>
        <Link className="btn btn-dark" to={`/book-event/${data.id}`}>
          view
        </Link>
        <button
          className="btn btn-warning"
          onClick={() => {
            dispatch(dltDriver(data.id));
          }}
          style={{ margin: '2% 4% 0% 0%' }}
        >
          delete
        </button>
      </div>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              margin: '2% 0% 0% 0%',
            }}
          >
            {Data}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverList;
