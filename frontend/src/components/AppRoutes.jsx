import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRouting';

// Public pages
import HomePage from './HomePage/HomePage';
import NotFound from './NotFound';
import ContactUs from './HomePage/ContactUs';
import GalleryUser from './HomePage/Gallery';
import Login from '../pages/auth/Login';
import Registration from '../pages/auth/Registration';
import FillDetails from '../pages/auth/FillDetails';
import DrivingDetails from '../pages/auth/DrivingDetails';
import StripePayment from '../pages/common/StripePayment';
import Success from '../pages/common/Success';
import Gallery from '../pages/common/Home/Gallery';

// Private pages
import AdminLayout from './layout/AdminLayout';
import Dashboard from '../pages/admin/Dashboard/Dashboard';
import ListVehicle from '../pages/admin/Vehicles/ListVehicle';
import AddUser from '../pages/admin/Users/AddUser';
import Profile from '../pages/common/Home/Profile';
import Feedbacks from '../pages/common/Home/Feedbacks';
import ViewFeedback from '../pages/common/Home/ViewFeedback';
import ChangePassword from '../pages/common/Home/ChangePassword';
import ActivityLogs from '../pages/admin/SystemLogs/ActivityLogs';
import TripRoutes from '../pages/admin/Routes/TripRoutes';
import AddRoutes from '../pages/admin/Routes/AddRoutes';
import DriverList from '../pages/admin/Drivers/DriverList';
import AddDrivers from '../pages/admin/Drivers/AddDrivers';
import ViewDriver from '../pages/admin/Drivers/ViewDriver';
import Trips from '../pages/admin/Trips/Trips';
import Transactions from '../pages/admin/Transactions/Transactions';
import Permissions from '../pages/admin/Permissions/Permissions';
import Settings from '../pages/admin/Settings/Settings';

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

      {/* ── Admin Area ── */}
      <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        {/* ── Dashboard ── */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ── Users ── */}
        <Route path="/add-user" element={<AddUser />} />

        {/* ── Vehicles ── */}
        <Route path="/vehicles" element={<ListVehicle />} />

        {/* ── Profile ── */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/view-feedback/:id" element={<ViewFeedback />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* ── Routes ── */}
        <Route path="/routes" element={<TripRoutes />} />
        <Route path="/add-routes" element={<AddRoutes />} />
        <Route path="/edit-routes/:id" element={<AddRoutes />} />

        {/* ── Drivers ── */}
        <Route path="/drivers" element={<DriverList />} />
        <Route path="/add-drivers" element={<AddDrivers />} />
        <Route path="/edit-driver/:id" element={<AddDrivers />} />
        <Route path="/view-data/:id" element={<ViewDriver />} />

        {/* ── Trips ── */}
        <Route path="/trips" element={<Trips />} />

        {/* ── Transactions ── */}
        <Route path="/transactions" element={<Transactions />} />

        {/* ── Permissions ── */}
        <Route path="/permissions" element={<Permissions />} />

        {/* ── System ── */}
        <Route path="/activity-logs" element={<ActivityLogs />} />

         {/* ── Settings ── */}
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
