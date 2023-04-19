// feedback

import React from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, getMessageApprove } from '../../action';
import { useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';

const Feedbacks = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, []);

  const { feedbacks } = useSelector((e) => e.user);

  createTheme(
    'solarized',
    {
      text: {
        primary: 'yellow',
        secondary: 'green',
      },
      background: {
        default: '#002b36',
      },
      context: {
        background: '#cb4b16',
        text: '#FFFFFF',
      },
      divider: {
        default: '#073642',
      },
      action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
      },
    },
    'dark'
  );

  const columns = [
    {
      name: 'SENDER',
      selector: (row) => row.name,
    },
    {
      name: 'STATUS',
      selector: (row) => row.status,
    },

    {
      name: 'ACTION',
      selector: (row) => (
        <div>
          {' '}
          <Link className="btn btn-info" to={`/view-feedback/${row.id}`}>
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
          <DataTable
            columns={columns}
            data={feedbacks}
            pagination
            theme="solarized"
          />
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
