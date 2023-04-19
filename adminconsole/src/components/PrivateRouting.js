import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const Role = localStorage.getItem('currentUser')
    ? localStorage.getItem('currentUser')
    : '';
  if (!Role) {
    return <Navigate to="/login" />;
  }

  return children;
};