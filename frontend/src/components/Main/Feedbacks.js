import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, dltFeedBack } from '../../action';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';

const Feedbacks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const { feedbacks } = useSelector((e) => e.user);

  createTheme(
    'solarized',
    {
      text: { primary: '#f8fafc', secondary: '#94a3b8' },
      background: { default: 'transparent' },
      context: { background: '#cb4b16', text: '#FFFFFF' },
      divider: { default: 'rgba(255, 255, 255, 0.1)' },
      action: { button: 'rgba(255,255,255,.54)', hover: 'rgba(255,255,255,.08)', disabled: 'rgba(255,255,255,.12)' },
    },
    'dark'
  );

  const columns = [
    { name: 'Sender', selector: (row) => row.name || 'Anonymous' },
    { name: 'Status', selector: (row) => row.status || 'N/A' },
    {
      name: 'Action',
      minWidth: '200px',
      selector: (row) => (
        <div>
          <Link className="btn btn-info btn-sm me-2" to={`/view-feedback/${row.id}`}>
            Read
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => dispatch(dltFeedBack(row.id))}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Feedbacks Found" 
      description="There are currently no feedbacks available to display." 
      icon="bi-chat-left-text" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">User Feedbacks</h1>
            <p className="dashboard-subtitle">Review and manage feedback submitted by users.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={feedbacks || []}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
          />
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
