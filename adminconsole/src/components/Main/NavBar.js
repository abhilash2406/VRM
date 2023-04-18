import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setLogout } from '../../action';

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = (e) => {
    e.preventDefault();
    dispatch(setLogout(() => navigate('/login')));
  };

  return (
    <div className="col-sm-auto bg-light sticky-top">
      <div className="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top">
        <a
          href="/dashboard"
          className="d-block p-3 link-dark text-decoration-none pb-3"
          title=""
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-original-title="Icon-only"
        >
          {' '}
          T.T LOGISTICS
          <i className="bi-bootstrap fs-1"></i>
        </a>
        <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center align-items-center">
          <li className="nav-item">
            <Link to={'/dashboard'} className="nav-link text-dark fw-bold fs-4">
              <i className="bi-house fs-3"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item my-2 ">
            <Link to={'/trucks'} className="nav-link text-dark fw-bold fs-4">
              <i className="bi-truck fs-3"></i> Trucks
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to={'/routes'} className="nav-link text-dark fw-bold fs-4">
              <i className="bi-speedometer2 fs-3"></i> Routes
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to={'/drivers'} className="nav-link text-dark fw-bold fs-4">
              <i className="bi-people fs-3"></i> Driver
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to={'/trips'} className="nav-link text-dark fw-bold fs-4">
              <i className="bi-speedometer2 fs-3"></i> Trips
            </Link>
          </li>

          <li className="nav-item my-2">
            <Link
              to={'/transactions'}
              className="nav-link text-dark fw-bold fs-4"
            >
              <i className=" bi bi-cash fs-3"></i> Transactions
            </Link>
          </li>

          <li className="nav-item my-2">
            <Link
              to={'/permissions'}
              className="nav-link text-dark fw-bold fs-4"
            >
              <i className=" bi bi-lock fs-3"></i> Permissions
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to={'/gallery'} className="nav-link text-dark fw-bold fs-4">
              <i className=" bi bi-image fs-3"></i> Gallery
            </Link>
          </li>
          <li className="nav-item my-2">
            <Link to={'/feedbacks'} className="nav-link text-dark fw-bold fs-4">
              <i className=" bi bi-book fs-3"></i> Feedbacks
            </Link>
          </li>
        </ul>
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle"
            id="dropdownUser3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi-person-circle h2"></i>
          </a>
          <ul
            className="dropdown-menu text-small shadow"
            aria-labelledby="dropdownUser3"
          >
            <li>
              <button className="btn btn-dark mx-2" onClick={logout}>
                Logout
              </button>
            </li>
            <li>
              <Link className="dropdown-item" to={'/change-password'}>
                change password
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to={'/profile'}>
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
