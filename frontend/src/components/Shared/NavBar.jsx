import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Cookies from 'js-cookie';
import '../../style/Dashboard.css';
import ChatbotModal from './ChatbotModal';

const NavBar = () => {
  const navigate = useNavigate();
  const { setLogout, grantedPermissions } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  const [notifications] = useState([
    { id: 1, text: "New driver registration pending approval", time: "5 mins ago", unread: true },
    { id: 2, text: "Trip #1024 completed successfully", time: "1 hour ago", unread: true },
    { id: 3, text: "Payment of $150 received", time: "2 hours ago", unread: false }
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  const logout = (e) => {
    e.preventDefault();
    Cookies.remove('token');
    localStorage.removeItem('currentUser');
    setLogout();
    navigate('/login');
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const userRole = currentUser.designation;
  const userName = currentUser.name || 'Admin';

  let array = grantedPermissions?.filter((item) => item.menu === 'Admin');
  let permissionAllowed = array?.map((e) => e.subMenu);

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const toggleTheme = () => setIsLightMode(!isLightMode);

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

      <div className="top-actions-container">
        {/* Theme Toggle */}
        <button className="action-btn" onClick={toggleTheme} title="Toggle Theme">
          <i className={`bi ${isLightMode ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
        </button>
        
        {/* Notification Bell */}
        <div className="dropdown">
          <button className="action-btn" data-bs-toggle="dropdown" aria-expanded="false" title="Notifications">
            <i className="bi-bell-fill"></i>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow" style={{ minWidth: '300px' }}>
            <li><h6 className="dropdown-header">Notifications</h6></li>
            {notifications.map(n => (
              <li key={n.id}>
                <a className="dropdown-item" href="#">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="dropdown-item-title" style={{ fontWeight: n.unread ? '600' : 'normal', fontSize: '0.85rem', whiteSpace: 'normal' }}>{n.text}</span>
                    {n.unread && <span className="badge bg-primary ms-2" style={{fontSize: '0.6rem'}}>New</span>}
                  </div>
                  <div className="dropdown-item-time" style={{ fontSize: '0.7rem' }}>{n.time}</div>
                </a>
              </li>
            ))}
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-center view-all-link" href="#" style={{fontSize: '0.85rem'}}>View All</a></li>
          </ul>
        </div>

        {/* Chatbot Toggle */}
        <button 
          className="action-btn chatbot-btn"
          onClick={toggleChatbot}
          title="Open Assistant"
        >
          <i className="bi-robot"></i>
        </button>
      </div>

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

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

      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center">
          <Link to="/dashboard" className="brand-title">
            <span className="brand-text">DriveOn<span>Ryd</span></span>
            <span className="brand-icon d-none">D<span>R</span></span>
          </Link>
          <button 
            className="collapse-toggle-btn d-none d-lg-flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title="Toggle Sidebar"
          >
            <i className={`bi bi-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
          </button>
      </div>

      <div className="sidebar-nav">
        <div className="nav-item">
          <Link to="/dashboard" className={`nav-link-custom ${isActive('/dashboard') ? 'active' : ''}`} title="Dashboard">
            <i className="bi-house-door"></i> <span className="nav-text">Dashboard</span>
          </Link>
        </div>
        
        <div className="nav-item">
          <Link to="/vehicles" className={`nav-link-custom ${isActive('/vehicles') ? 'active' : ''}`} title="Vehicles">
            <i className="bi-truck"></i> <span className="nav-text">Vehicles</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/trips" className={`nav-link-custom ${isActive('/trips') ? 'active' : ''}`} title="Journeys">
            <i className="bi-map"></i> <span className="nav-text">Journeys</span>
          </Link>
        </div>

        {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/add-user" className={`nav-link-custom ${isActive('/add-user') ? 'active' : ''}`} title="Users">
              <i className="bi-person"></i> <span className="nav-text">Users</span>
            </Link>
          </div>
        )}

        {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/transactions" className={`nav-link-custom ${isActive('/transactions') ? 'active' : ''}`} title="Transactions">
              <i className="bi-credit-card"></i> <span className="nav-text">Transactions</span>
            </Link>
          </div>
        )}

        {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/drivers" className={`nav-link-custom ${isActive('/drivers') ? 'active' : ''}`} title="Drivers">
              <i className="bi-people"></i> <span className="nav-text">Drivers</span>
            </Link>
          </div>
        )}

        {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/activity-logs" className={`nav-link-custom ${isActive('/activity-logs') ? 'active' : ''}`} title="Activity Logs">
              <i className="bi-shield-lock"></i> <span className="nav-text">Activity Logs</span>
            </Link>
          </div>
        )}

         {(userRole === 'Admin' || userRole === 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/settings" className={`nav-link-custom ${isActive('/settings') ? 'active' : ''}`} title="Settings">
              <i className="bi-person"></i> <span className="nav-text">Settings</span>
            </Link>
          </div>
        )}

        {(userRole !== 'Admin' && userRole !== 'SUPERADMIN') && (
          <div className="nav-item">
            <Link to="/routes" className={`nav-link-custom ${isActive('/routes') ? 'active' : ''}`} title="Routes">
              <i className="bi-signpost-split"></i> <span className="nav-text">Routes</span>
            </Link>
          </div>
        )}

        {(userRole !== 'Admin' && userRole !== 'SUPERADMIN') && userRole === 'Manager' && (
          <>
            <div className="nav-item">
              <Link to="/gallery" className={`nav-link-custom ${isActive('/gallery') ? 'active' : ''}`} title="Gallery">
                <i className="bi-images"></i> <span className="nav-text">Gallery</span>
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/feedbacks" className={`nav-link-custom ${isActive('/feedbacks') ? 'active' : ''}`} title="Feedbacks">
                <i className="bi-chat-left-text"></i> <span className="nav-text">Feedbacks</span>
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
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info ms-3 flex-grow-1 text-truncate">
              <span className="user-name d-block text-truncate">{userName}</span>
              <span className="user-role d-block text-truncate">{userRole || 'User'}</span>
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
