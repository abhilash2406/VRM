import React from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, getMessageApprove } from '../../action';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';

const Feedbacks = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, []);

  const { feedbacks } = useSelector((e) => e.user);

  const columns = [
    {
      name: 'sender',
      selector: (row) => row.name,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
    },

    {
      name: 'action',
      selector: (row) => (
        <div>
          {' '}
          <Link className="btn btn-dark" to={`/view-feedback/${row.id}`}>
            Read
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <DataTable columns={columns} data={feedbacks} pagination />
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
