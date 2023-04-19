import React, { useEffect } from 'react';
import Home from './Home/Home';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import Dashboard from './Main/Dashboard';
import ListTruck from './TruckManagement/ListTruck';
import Profile from './Main/Profile';
import Feedbacks from './Main/Feedbacks';
import ViewFeedback from './Main/ViewFeedback';
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
          <Route path="/dashboard" element={<Dashboard />} />;
          <Route path="/trucks" element={<ListTruck />} />;
          <Route path="/profile" element={<Profile />} />;
          <Route path="/feedbacks" element={<Feedbacks />} />;
          <Route path="/view-feedback/:id" element={<ViewFeedback />} />;




        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
