import React, { useEffect } from 'react';
import Home from './Home/Home';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import Dashboard from './Main/Dashboard';
import ListTruck from './TruckManagement/ListTruck';
import Profile from './Main/Profile';
import Feedbacks from './Main/Feedbacks';
import ViewFeedback from './Main/ViewFeedback';
import Gallery from './Main/Gallery';
import TripRoutes from './RouteManagement/TripRoutes';
import DriverList from './DriverManagement.js/DriverList';
import Trips from './TripManagement/Trips';
import Transactions from './Transactions/Transactions';
import Permissions from './PermissionManagement/Permissions';
import { PrivateRoute } from './PrivateRouting';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetSuccessMessage, resetErrorMessage } from '../action';

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

const App = () => {
  const dispatch = useDispatch();
  const { successMsg, errorMsg } = useSelector((e) => e.msg);

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
          <Route path="/" element={<Home />} />;
          <Route path="/login" element={<Login />} />;
          <Route path="/signup" element={<Registration />} />;
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
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
            path="/drivers"
            element={
              <PrivateRoute>
                <DriverList />
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
          ;
          <Route path="/gallery" element={<Gallery />} />;
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
