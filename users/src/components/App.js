import React, { useEffect } from 'react';
import HomePage from './HomePage/HomePage';
import ContactUs from './HomePage/ContactUs';
// import LoginPage from './Authentication/LoginPage';
import Gallery from './HomePage/Gallery';
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
          <Route path="/" element={<HomePage />} />;
          <Route path="/contact-us" element={<ContactUs />} />;
          {/* <Route path="/login" element={<LoginPage />} />; */}
          <Route path="/gallery" element={<Gallery />} />;
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
