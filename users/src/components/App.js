import React from 'react';
import HomePage from './HomePage/HomePage';
import ContactUs from './HomePage/ContactUs';
import LoginPage from './Authentication/LoginPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />;
          <Route path="/contact-us" element={<ContactUs />} />;
          <Route path="/login" element={<LoginPage />} />;
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
