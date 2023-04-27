// dashboard

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './NavBar';
import { fetchFeedbacks } from '../../action';
import { getAllTruckData } from '../TruckManagement/action';
import { getRoutes } from '../RouteManagement/action';
import Graph from './Graph';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFeedbacks());
    dispatch(getAllTruckData());
    dispatch(getRoutes());
  }, []);
  const { feedbacks } = useSelector((e) => e.user);
  const { truckData } = useSelector((e) => e.truck);
  const { routeData } = useSelector((e) => e.routes);


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
          <div className="d-flex flex-column">
            <div className="d-flex">
              <div className="card" style={{ width: '15rem' }}>
                <div className="card-body">
                  <h5 className="card-title">No of user messages</h5>
                  <p className="card-text">{feedbacks.length}</p>
                </div>
              </div>

              <div className="card" style={{ width: '15rem' }}>
                <div className="card-body">
                  <h5 className="card-title">No of drivers</h5>
                  <p className="card-text">{feedbacks.length}</p>
                </div>
              </div>
              <div className="card" style={{ width: '15rem' }}>
                <div className="card-body">
                  <h5 className="card-title">No of trucks</h5>
                  <p className="card-text">{truckData.length}</p>
                </div>
              </div>
              <div className="card" style={{ width: '15rem' }}>
                <div className="card-body">
                  <h5 className="card-title">No of routes</h5>
                  <p className="card-text">{routeData.length}</p>
                </div>
              </div>
            </div>

            <Graph data={tripsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
