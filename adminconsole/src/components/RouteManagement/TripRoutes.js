//trip list

import React from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const TripRoutes = () => {
  const { grantedPermissions } = useSelector((state) => state.auth);
  console.log('grantedPermissions', grantedPermissions);
  let array = grantedPermissions?.filter((item) => item.menu === 'Route');

  let permissionAllowed = array?.map((e) => e.subMenu);
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
        </div>
      </div>
    </div>
  );
};

export default TripRoutes;
