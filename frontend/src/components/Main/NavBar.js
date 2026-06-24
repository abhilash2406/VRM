import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../action';
import '../../style/Dashboard.css';

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const logout = (e) => {
    e.preventDefault();
    dispatch(setLogout(() => navigate('/login')));
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;

  const { grantedPermissions } = useSelector((state) => state.auth);
  let array = grantedPermissions?.filter((item) => item.menu === 'Admin');
  let permissionAllowed = array?.map((e) => e.subMenu);

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button 
        className="mobile-nav-toggle d-lg-none" 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1002,
          background: 'linear-gradient(90deg, #00D4FF, #0066FF)',
          border: 'none',
          color: 'white',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        <i className={`bi ${isSidebarOpen ? 'bi-x-lg' : 'bi-list'}`} style={{ fontSize: '1.5rem' }}></i>
      </button>

      {isSidebarOpen && (
        <div 
          className="sidebar-overlay d-lg-none"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
        ></div>
      )}

      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="brand-title">
            DriveOn<span>Ryd</span>
          </Link>
      </div>

      <div className="sidebar-nav">
        <div className="nav-item">
          <Link to="/dashboard" className={`nav-link-custom ${isActive('/dashboard') ? 'active' : ''}`}>
            <i className="bi-house-door"></i> Dashboard
          </Link>
        </div>
        
        <div className="nav-item">
          <Link to="/trucks" className={`nav-link-custom ${isActive('/trucks') ? 'active' : ''}`}>
            <i className="bi-truck"></i> Vehicles
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/trips" className={`nav-link-custom ${isActive('/trips') ? 'active' : ''}`}>
            <i className="bi-map"></i> Journeys
          </Link>
        </div>

        {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/add-user" className={`nav-link-custom ${isActive('/add-user') ? 'active' : ''}`}>
              <i className="bi-person"></i> Users
            </Link>
          </div>
        )}

        {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/transactions" className={`nav-link-custom ${isActive('/transactions') ? 'active' : ''}`}>
              <i className="bi-credit-card"></i> Transactions
            </Link>
          </div>
        )}

        {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/drivers" className={`nav-link-custom ${isActive('/drivers') ? 'active' : ''}`}>
              <i className="bi-people"></i> Drivers
            </Link>
          </div>
        )}

        {(userRole !== 'Admin' && userRole !== 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/routes" className={`nav-link-custom ${isActive('/routes') ? 'active' : ''}`}>
              <i className="bi-signpost-split"></i> Routes
            </Link>
          </div>
        )}

        {(userRole !== 'Admin' && userRole !== 'SUPERADMIN') && userRole === 'Manager' && (
          <>
            <div className="nav-item">
              <Link to="/gallery" className={`nav-link-custom ${isActive('/gallery') ? 'active' : ''}`}>
                <i className="bi-images"></i> Gallery
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/feedbacks" className={`nav-link-custom ${isActive('/feedbacks') ? 'active' : ''}`}>
                <i className="bi-chat-left-text"></i> Feedbacks
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="dropup w-100">
          <div 
            className="user-profile w-100 d-flex align-items-center" 
            id="dropdownMenuButton" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
            style={{ cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'background 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div className="user-avatar" style={{ minWidth: '40px' }}>
              {userRole ? userRole.charAt(0) : 'U'}
            </div>
            <div className="user-info ms-3 flex-grow-1 text-truncate">
              <span className="user-name d-block text-truncate" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Welcome Back</span>
              <span className="user-role d-block text-truncate" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{userRole || 'User'}</span>
            </div>
            <i className="bi-gear text-muted" style={{ fontSize: '1.1rem' }}></i>
          </div>
          
          <ul className="dropdown-menu dropdown-menu-dark w-100 shadow mb-2" aria-labelledby="dropdownMenuButton">
            <li><Link className="dropdown-item" to="/profile"><i className="bi-person me-2"></i> Profile</Link></li>
            <li><Link className="dropdown-item" to="/change-password"><i className="bi-key me-2"></i> Change Password</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item text-danger" onClick={logout}><i className="bi-box-arrow-right me-2"></i> Logout</button></li>
          </ul>
        </div>
      </div>
    </aside>
    </>
  );
};

export default NavBar;
