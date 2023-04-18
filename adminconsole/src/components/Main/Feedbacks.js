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
  console.log('feedbacks', feedbacks);

  const columns = [
    {
      name: 'name',
      selector: (row) => row.name,
    },

    {
      name: 'phone',
      selector: (row) => row.phoneNumber,
    },
    {
      name: ' e-mail',
      selector: (row) => row.email,
    },
    {
      name: 'Message',
      selector: (row) => row.message,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
    },

    {
      name: 'action',
      selector: (row) =>
        row.status === 'unread' ? (
          <div>
            {' '}
            <button
              className="btn btn-dark"
              onClick={() => {
                dispatch(getMessageApprove({ id: row.id }));
                dispatch(fetchFeedbacks());
              }}
            >
              Mark as read
            </button>
          </div>
        ) : null,
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
