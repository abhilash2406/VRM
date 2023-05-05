// dashboard

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './NavBar';
import { fetchFeedbacks } from '../../action';
import { getAllTruckData } from '../TruckManagement/action';
import { getRoutes } from '../RouteManagement/action';
import { getAllDrivers } from '../DriverManagement.js/action';
import { noOfTrips, getAllTrips } from '../TripManagement/index';

import Graph from './Graph';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFeedbacks());
    dispatch(getAllTruckData());
    dispatch(getAllDrivers());
    dispatch(getRoutes());
    dispatch(noOfTrips());
    dispatch(getAllTrips())
  }, []);
  const { feedbacks } = useSelector((e) => e.user);
  const { truckData } = useSelector((e) => e.truck);
  const { driverData } = useSelector((e) => e.driver);
  const { routeData } = useSelector((e) => e.routes);
  const { Trips } = useSelector((e) => e.routes);
  const { trips } = useSelector((e) => e.routes);

  console.log('Trips', trips)
  const { grantedPermissions } = useSelector((state) => state.auth);

  let array = grantedPermissions?.filter((item) => item.menu === 'Dashboard');

  let permissionAllowed = array?.map((e) => e.subMenu);

  const [tripsData, setTripsData] = useState([]);
  useEffect(() => {
    // Fetch trips data from API or generate random data here
    const randomData = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 100)
    );
    setTripsData(randomData);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <section>
            <div className="d-flex flex-column">
              <div className="d-flex">
                {permissionAllowed?.includes('no_of_messages') ? (
                  <div className="card" style={{ width: '12rem' }}>
                    <div className="card-body">
                      <h5 className="card-title">No of user messages</h5>
                      <p className="card-text">{feedbacks?.length}</p>
                    </div>
                  </div>
                ) : null}
                {permissionAllowed?.includes('no_of_drivers') ? (
                  <div className="card" style={{ width: '12rem' }}>
                    <div className="card-body">
                      <h5 className="card-title">No of drivers</h5>
                      <p className="card-text">{driverData?.length}</p>
                    </div>
                  </div>
                ) : null}
                <div className="card" style={{ width: '12rem' }}>
                  <div className="card-body">
                    <h5 className="card-title">No of trucks</h5>
                    <p className="card-text">{truckData?.length}</p>
                  </div>
                </div>
                <div className="card" style={{ width: '12rem' }}>
                  <div className="card-body">
                    <h5 className="card-title">No of trips in last 30 days</h5>
                    <p className="card-text">{Trips?.length}</p>
                  </div>
                </div>
                {permissionAllowed?.includes('no_of_routes') ? (
                  <div className="card" style={{ width: '12rem' }}>
                    <div className="card-body">
                      <h5 className="card-title">No of routes</h5>
                      <p className="card-text">{routeData?.length}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="w-75">
                <Graph trips={trips} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
