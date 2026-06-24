// read individual feed back page

import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFeedback } from '../../hooks/queries/useProfileQueries';

const ViewFeedback = () => {
  const { id } = useParams();

  const { data: feedback } = useFeedback(id);

  return (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">Feed Back</h5>
        <h6 className="card-subtitle mb-2 text-muted">{feedback?.name}</h6>
        <p className="card-text">
          {feedback?.message}
        </p>
        <p href="#" className="card-link">
          {feedback?.email}
        </p>
        <Link to={'/feedbacks'}>back</Link>
      </div>
    </div>
  );
};

export default ViewFeedback;
