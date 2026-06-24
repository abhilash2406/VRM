import logger from '../../utils/logger';
// view profile page

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/queries/useProfileQueries';

const Profile = () => {
  const { data: userData } = useProfile();
  logger.info('userData', userData);
  return (
    <div>
      <h2>{userData?.name}</h2>
      <h2>{userData?.phoneNumber}</h2>
      <Link to={'/dashboard'} className='btn btn-dark'>back</Link>
    </div>
  );
};

export default Profile;
