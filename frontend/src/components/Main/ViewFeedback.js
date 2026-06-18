// read individual feed back page

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { readFeedback } from '../../action';

const ViewFeedback = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(readFeedback(id));
  }, []);
  const { feedback } = useSelector((e) => e.user);
  

  return (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">Feed Back</h5>
        <h6 className="card-subtitle mb-2 text-muted">{feedback.name}</h6>
        <p className="card-text">
          {feedback.message}
        </p>
        <p href="#" className="card-link">
          {feedback.email}
        </p>
        <Link to={'/feedbacks'}>back</Link>
      </div>
    </div>
  );
};

export default ViewFeedback;
