import React, { useEffect, useState } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTrips } from './index';

const Trips = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllTrips());
  }, []);

  const { trips } = useSelector((e) => e.routes);
  console.log('trips', trips);

  const { grantedPermissions } = useSelector((state) => state.auth);

  let array = grantedPermissions?.filter((item) => item.menu === 'Trip');

  let permissionAllowed = array?.map((e) => e.subMenu);

  const tableData = trips.map((trp, index) => {
    return (
      <tr>
        <th scope="row">1</th>
        <td>{trp.driver.user.name}</td>
        <td>{trp.route.from}</td>
        <td>{trp.route.to}</td>
        <td>{trp.truck.brand}</td>
      </tr>
    );
  });
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          {permissionAllowed?.includes('Add') ? (
            <Link to="/add-trips">
              <button className="btn btn-info add-btn">Add trip</button>
            </Link>
          ) : null}
          <div>
            <table class="table table-dark mt-5">
              <thead>
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">Driver</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Truck</th>
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

export default Trips;
