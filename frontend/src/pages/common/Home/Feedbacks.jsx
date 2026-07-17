import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFeedbacks, useDeleteFeedback } from '../../../hooks/queries/useProfileQueries';
import AppDataTable from '../../../components/Shared/AppDataTable';
import NotFound from '../../../components/NotFound';

const Feedbacks = () => {
  const { data: feedbacks } = useFeedbacks();
  const { mutate: deleteFeedback } = useDeleteFeedback();

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
            onClick={() => deleteFeedback(row.id)}
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
    <>
      <div className="dashboard-header mb-4">
        <div>
            <h1 className="dashboard-title">User Feedbacks</h1>
            <p className="dashboard-subtitle">Review and manage feedback submitted by users.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <AppDataTable
            columns={columns}
            data={feedbacks || []}

            noDataComponent={customNoData}
          />
        </div>
    </>
  );
};

export default Feedbacks;
