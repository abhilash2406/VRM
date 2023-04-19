// view profile page

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { viewProfile } from '../../action';

const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(viewProfile());
  },[]);

  const { userData } = useSelector((e) => e.user);
  console.log('userData', userData);
  return (
    <div>
      <h2>{userData.name}</h2>
      <h2>{userData.phoneNumber}</h2>
      <Link to={'/dashboard'} className='btn btn-dark'>back</Link>
    </div>
  );
};

export default Profile;
