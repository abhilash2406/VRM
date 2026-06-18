import logger from '../utils/logger';
import React, { useEffect } from 'react';
import HomePage from './HomePage/HomePage';
import ContactUs from './HomePage/ContactUs';
import GalleryUser from './HomePage/Gallery';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import Dashboard from './Main/Dashboard';
import ListTruck from './TruckManagement/ListTruck';
import AddTruck from './TruckManagement/AddTruck';
import Profile from './Main/Profile';
import Feedbacks from './Main/Feedbacks';
import ViewFeedback from './Main/ViewFeedback';
import Gallery from './Main/Gallery';
import TripRoutes from './RouteManagement/TripRoutes';
import AddRoutes from './RouteManagement/AddRoutes';
import DriverList from './DriverManagement.js/DriverList';
import Trips from './TripManagement/Trips';
import AddTrips from './TripManagement/AddTrips';
import Transactions from './Transactions/Transactions';
import Permissions from './PermissionManagement/Permissions';
import AddUser from './AddUsers/AddUser';
import FillDetails from './Authentication/FillDetails';
import DrivingDetails from './Authentication/DrivingDetails';
import AddDrivers from './DriverManagement.js/AddDrivers';
import CardDetails from './Authentication/CardDetails';
import ViewDriver from './DriverManagement.js/ViewDriver';
import StripePayment from './Authentication/StripePayment';
import Success from './Authentication/Success';
import { PrivateRoute } from './PrivateRouting';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import ChangePassword from './Main/ChangePassword';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetSuccessMessage, resetErrorMessage } from '../action';
import {
  setCurrentPermissions,
  permissionOfLogin,
} from './PermissionManagement/action';

const toastConfig = {
  position: 'top-right',
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
};

const socket = io.connect('http://localhost:5000');

const App = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((e) => e.auth);
  const { successMsg, errorMsg } = useSelector((e) => e.msg);
  useEffect(() => {
    socket.on('GetPermissions', (data) => {
      logger.info('socketData', data);

      dispatch(setCurrentPermissions(role, data));
    });
  }, [socket]);

  useEffect(() => {
    dispatch(permissionOfLogin());
  }, []);

  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg, toastConfig);
      dispatch(resetSuccessMessage());
    } else if (errorMsg) {
      toast.error(errorMsg, toastConfig);
      dispatch(resetErrorMessage());
    }
  }, [successMsg, errorMsg]);

  return (
    <div>
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />;
          <Route path="/contact-us" element={<ContactUs />} />;
          <Route path="/image-gallery" element={<GalleryUser />} />;
          <Route path="/login" element={<Login />} />;
          <Route path="/signup" element={<Registration />} />;
          <Route path="/fill-details" element={<FillDetails />} />;
          <Route path="/driver-details" element={<DrivingDetails />} />;
          <Route path="/payment" element={<StripePayment />} />;
          <Route path="/success" element={<Success />} />;
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <PrivateRoute>
                <AddUser />
              </PrivateRoute>
            }
          />
          ;
          <Route
            path="/trucks"
            element={
              <PrivateRoute>
                <ListTruck />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-trucks"
            element={
              <PrivateRoute>
                <AddTruck />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-trucks/:id"
            element={
              <PrivateRoute>
                <AddTruck />
              </PrivateRoute>
            }
          />
          ;
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          ;
          <Route
            path="/feedbacks"
            element={
              <PrivateRoute>
                <Feedbacks />
              </PrivateRoute>
            }
          />
          ;
          <Route
            path="/view-feedback/:id"
            element={
              <PrivateRoute>
                <ViewFeedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <PrivateRoute>
                <TripRoutes />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-routes/:id"
            element={
              <PrivateRoute>
                <AddRoutes />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-routes"
            element={
              <PrivateRoute>
                <AddRoutes />
              </PrivateRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <PrivateRoute>
                <DriverList />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-drivers"
            element={
              <PrivateRoute>
                <AddDrivers />
              </PrivateRoute>
            }
          />
           <Route
            path="/edit-driver/:id"
            element={
              <PrivateRoute>
                <AddDrivers />
              </PrivateRoute>
            }
          />
             <Route
            path="/view-data/:id"
            element={
              <PrivateRoute>
                <ViewDriver />
              </PrivateRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <PrivateRoute>
                <Trips />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-trips"
            element={
              <PrivateRoute>
                <AddTrips />
              </PrivateRoute>
            }
          />
           <Route
            path="/edit-trips/:id"
            element={
              <PrivateRoute>
                <AddTrips />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <PrivateRoute>
                <Permissions />
              </PrivateRoute>
            }
          />
             <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />
          ;
          <Route path="/gallery" element={<Gallery />} />;
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
