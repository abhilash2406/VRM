import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRouting';

// Public pages
import HomePage from './HomePage/HomePage';
import NotFound from './NotFound';
import ContactUs from './HomePage/ContactUs';
import GalleryUser from './HomePage/Gallery';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import FillDetails from './Authentication/FillDetails';
import DrivingDetails from './Authentication/DrivingDetails';
import StripePayment from './Authentication/StripePayment';
import Success from './Authentication/Success';
import Gallery from './ProfileManagement/Gallery';

// Private pages
import Dashboard from './Dashboard/Dashboard';
import ListVehicle from './VehicleManagement/ListVehicle';
import AddUser from './AddUsers/AddUser';
import Profile from './ProfileManagement/Profile';
import Feedbacks from './ProfileManagement/Feedbacks';
import ViewFeedback from './ProfileManagement/ViewFeedback';
import ChangePassword from './ProfileManagement/ChangePassword';
import ActivityLogs from './SystemLogs/ActivityLogs';
import TripRoutes from './RouteManagement/TripRoutes';
import AddRoutes from './RouteManagement/AddRoutes';
import DriverList from './DriverManagement.js/DriverList';
import AddDrivers from './DriverManagement.js/AddDrivers';
import ViewDriver from './DriverManagement.js/ViewDriver';
import Trips from './TripManagement/Trips';
import AddTrips from './TripManagement/AddTrips';
import Transactions from './Transactions/Transactions';
import Permissions from './PermissionManagement/Permissions';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/image-gallery" element={<GalleryUser />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/fill-details" element={<FillDetails />} />
      <Route path="/driver-details" element={<DrivingDetails />} />
      <Route path="/payment" element={<StripePayment />} />
      <Route path="/success" element={<Success />} />
      <Route path="/gallery" element={<Gallery />} />

      {/* ── Dashboard ── */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* ── Users ── */}
      <Route path="/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>} />

      {/* ── Vehicles ── */}
      <Route path="/vehicles" element={<PrivateRoute><ListVehicle /></PrivateRoute>} />

      {/* ── Profile ── */}
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/feedbacks" element={<PrivateRoute><Feedbacks /></PrivateRoute>} />
      <Route path="/view-feedback/:id" element={<PrivateRoute><ViewFeedback /></PrivateRoute>} />
      <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

      {/* ── Routes ── */}
      <Route path="/routes" element={<PrivateRoute><TripRoutes /></PrivateRoute>} />
      <Route path="/add-routes" element={<PrivateRoute><AddRoutes /></PrivateRoute>} />
      <Route path="/edit-routes/:id" element={<PrivateRoute><AddRoutes /></PrivateRoute>} />

      {/* ── Drivers ── */}
      <Route path="/drivers" element={<PrivateRoute><DriverList /></PrivateRoute>} />
      <Route path="/add-drivers" element={<PrivateRoute><AddDrivers /></PrivateRoute>} />
      <Route path="/edit-driver/:id" element={<PrivateRoute><AddDrivers /></PrivateRoute>} />
      <Route path="/view-data/:id" element={<PrivateRoute><ViewDriver /></PrivateRoute>} />

      {/* ── Trips ── */}
      <Route path="/trips" element={<PrivateRoute><Trips /></PrivateRoute>} />
      <Route path="/add-trips" element={<PrivateRoute><AddTrips /></PrivateRoute>} />
      <Route path="/edit-trips/:id" element={<PrivateRoute><AddTrips /></PrivateRoute>} />

      {/* ── Transactions ── */}
      <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />

      {/* ── Permissions ── */}
      <Route path="/permissions" element={<PrivateRoute><Permissions /></PrivateRoute>} />

      {/* ── System ── */}
      <Route path="/activity-logs" element={<PrivateRoute><ActivityLogs /></PrivateRoute>} />

      {/* ── Fallback ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
