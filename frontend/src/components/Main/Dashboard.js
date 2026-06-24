import logger from '../../utils/logger';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './NavBar';
import { fetchFeedbacks } from '../../action';
import { getAllTruckData } from '../TruckManagement/action';
import { getRoutes } from '../RouteManagement/action';
import { getAllDrivers } from '../DriverManagement.js/action';
import { noOfTrips, getAllTrips } from '../TripManagement/index';
import { getAllTransactions } from '../Transactions/action';
import Web3 from 'web3';
import Graph from './Graph';
import RevenueGraph from './RevenueGraph';
import moment from 'moment';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const accounts = web3.utils.toTwosComplement('-1');
          logger.info(accounts.toString());
        }
      } catch (err) {
        logger.info("Web3 error", err);
      }
    })();
  }, []);

  useEffect(() => {
    dispatch(fetchFeedbacks());
    dispatch(getAllTruckData());
    dispatch(getAllDrivers());
    dispatch(getRoutes());
    dispatch(noOfTrips());
    dispatch(getAllTrips());
    dispatch(getAllTransactions());
  }, [dispatch]);

  const { feedbacks } = useSelector((e) => e.user);
  const { truckData } = useSelector((e) => e.truck);
  const { driverData } = useSelector((e) => e.driver);
  const { routeData } = useSelector((e) => e.routes);
  const { Trips } = useSelector((e) => e.routes); // Number of trips in last 30 days
  const { trips } = useSelector((e) => e.routes); // All trips
  const { transactions } = useSelector((e) => e.transc);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;

  const { grantedPermissions } = useSelector((state) => state.auth);

  let array = grantedPermissions?.filter((item) => item.menu === 'Dashboard');
  let permissionAllowed = array?.map((e) => e.subMenu);

  // Take top 5 recent feedbacks
  const recentFeedbacks = Array.isArray(feedbacks) ? feedbacks.slice(0, 5) : [];
  
  // Take top 5 recent trips
  const recentTrips = Array.isArray(trips) ? trips.slice(0, 5) : [];

  // Calculate total revenue from transactions
  const totalRevenue = Array.isArray(transactions) ? transactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0) : 0;
  
  // Take top 5 recent transactions
  const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 5) : [];

  const isAdminOrSuperAdmin = userRole === 'Admin' || userRole === 'SUPERADMIN';

  return (
    <div className="dashboard-layout">
      <NavBar />
      
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard </h1>
            <p className="dashboard-subtitle">Monitor and manage all operations from one place.</p>
          </div>
        </div>

        <div className="stats-grid">
          {isAdminOrSuperAdmin && (
            <div className="stat-card">
              <div className="stat-header">
                <h5 className="stat-title">Total Users</h5>
                <div className="stat-icon" style={{ color: '#8e44ad', background: 'rgba(142, 68, 173, 0.1)' }}><i className="bi-people-fill"></i></div>
              </div>
              <h2 className="stat-value">0</h2> {/* Add actual user count from Redux when backend is ready */}
            </div>
          )}

          {(isAdminOrSuperAdmin || permissionAllowed?.includes('no_of_messages')) && (
            <div className="stat-card">
              <div className="stat-header">
                <h5 className="stat-title">Total Feedbacks</h5>
                <div className="stat-icon"><i className="bi-chat-left-text"></i></div>
              </div>
              <h2 className="stat-value">{feedbacks?.length || 0}</h2>
            </div>
          )}

          {(isAdminOrSuperAdmin || permissionAllowed?.includes('no_of_drivers')) && (
            <div className="stat-card">
              <div className="stat-header">
                <h5 className="stat-title">Active Drivers</h5>
                <div className="stat-icon"><i className="bi-people"></i></div>
              </div>
              <h2 className="stat-value">{driverData?.length || 0}</h2>
            </div>
          )}

          <div className="stat-card">
            <div className="stat-header">
              <h5 className="stat-title">Total Trucks</h5>
              <div className="stat-icon"><i className="bi-truck"></i></div>
            </div>
            <h2 className="stat-value">{truckData?.length || 0}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h5 className="stat-title">Trips (Last 30 Days)</h5>
              <div className="stat-icon"><i className="bi-map"></i></div>
            </div>
            <h2 className="stat-value">{Trips?.length || 0}</h2>
          </div>

          {(isAdminOrSuperAdmin || permissionAllowed?.includes('no_of_routes')) && (
            <div className="stat-card">
              <div className="stat-header">
                <h5 className="stat-title">Total Routes</h5>
                <div className="stat-icon"><i className="bi-signpost-split"></i></div>
              </div>
              <h2 className="stat-value">{routeData?.length || 0}</h2>
            </div>
          )}

          {isAdminOrSuperAdmin && (
            <div className="stat-card">
              <div className="stat-header">
                <h5 className="stat-title">Total Revenue</h5>
                <div className="stat-icon" style={{ color: '#00D4FF', background: 'rgba(0, 212, 255, 0.1)' }}><i className="bi-currency-dollar"></i></div>
              </div>
              <h2 className="stat-value">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
          )}
          
          {isAdminOrSuperAdmin && (
            <div className="stat-card">
              <div className="stat-header">
                <h5 className="stat-title">Total Transactions</h5>
                <div className="stat-icon"><i className="bi-credit-card"></i></div>
              </div>
              <h2 className="stat-value">{transactions?.length || 0}</h2>
            </div>
          )}
        </div>

        {/* Detailed Data Section for Admin */}
        {isAdminOrSuperAdmin && (
          <>
            <div className="data-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
              <div className="glass-panel">
                <h3 className="panel-title">Trip Analytics <i className="bi-graph-up"></i></h3>
                <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                  <Graph trips={trips} />
                </div>
              </div>

              <div className="glass-panel">
                <h3 className="panel-title">Revenue Analytics <i className="bi-cash-stack"></i></h3>
                <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                  <RevenueGraph transactions={transactions} />
                </div>
              </div>
            </div>

            {/* New row for Recent Transactions and Recent Trips */}
            <div className="data-grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="glass-panel">
                <h3 className="panel-title">Recent Transactions <Link to="/transactions" className="btn btn-sm btn-outline-info">View All</Link></h3>
                <ul className="modern-list">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((tx, index) => (
                      <li className="list-item" key={index}>
                        <div className="item-main">
                          <div className="item-icon" style={{ background: 'rgba(0, 212, 255, 0.1)', color: '#00D4FF' }}>
                            <i className="bi-currency-dollar"></i>
                          </div>
                          <div className="item-details">
                            <h6>{tx.driver?.user?.first_name || 'Unknown'} {tx.driver?.user?.last_name || ''}</h6>
                            <p>{tx.type || 'Payment'}</p>
                          </div>
                        </div>
                        <span className="item-badge" style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71' }}>+${parseFloat(tx.amount || 0).toFixed(2)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="list-item">
                      <p className="text-muted m-0">No recent transactions found.</p>
                    </li>
                  )}
                </ul>
              </div>

              <div className="glass-panel">
                <h3 className="panel-title">Recent Trips <Link to="/trips" className="btn btn-sm btn-outline-info">View All</Link></h3>
                <ul className="modern-list">
                  {recentTrips.length > 0 ? (
                    recentTrips.map((trip, index) => (
                      <li className="list-item" key={index}>
                        <div className="item-main">
                          <div className="item-icon">
                            <i className="bi-geo-alt"></i>
                          </div>
                          <div className="item-details">
                            <h6>{trip.driver?.user?.first_name || 'Driver'} {trip.driver?.user?.last_name || ''}</h6>
                            <p>{trip.route?.from} &rarr; {trip.route?.to}</p>
                          </div>
                        </div>
                        <span className="item-badge" style={{ background: trip.trip_status === 'ongoing' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(46, 204, 113, 0.2)', color: trip.trip_status === 'ongoing' ? '#f1c40f' : '#2ecc71' }}>
                          {trip.trip_status || 'Completed'}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="list-item">
                      <p className="text-muted m-0">No recent trips found.</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Row for Recent Feedbacks */}
            <div className="data-grid mt-4" style={{ gridTemplateColumns: '1fr' }}>
              <div className="glass-panel">
                <h3 className="panel-title">Recent Feedbacks <Link to="/feedbacks" className="btn btn-sm btn-outline-info">View All</Link></h3>
                <ul className="modern-list">
                  {recentFeedbacks.length > 0 ? (
                    recentFeedbacks.map((fb, index) => (
                      <li className="list-item" key={index}>
                        <div className="item-main">
                          <div className="item-icon">
                            <i className="bi-person"></i>
                          </div>
                          <div className="item-details">
                            <h6>{fb.name || 'Anonymous User'}</h6>
                            <p>{fb.message ? (fb.message.substring(0, 80) + '...') : 'No message'}</p>
                          </div>
                        </div>
                        <span className="item-badge">{moment(fb.createdAt).format('MMM DD')}</span>
                      </li>
                    ))
                  ) : (
                    <li className="list-item">
                      <p className="text-muted m-0">No recent feedbacks found.</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;
