import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTransactions } from './action';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';

const Transactions = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllTransactions());
  }, [dispatch]);

  const { transactions } = useSelector((e) => e.transc);

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
    { name: 'Driver Name', selector: (row) => row.driver?.user?.name || 'N/A' },
    { name: 'Amount Paid', selector: (row) => row.amount ? `$${row.amount}` : 'N/A' },
    { name: 'Payment Type', selector: (row) => row.type || 'N/A' },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Transactions Found" 
      description="There are currently no transactions available to display." 
      icon="bi-credit-card" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Transactions</h1>
            <p className="dashboard-subtitle">Monitor financial transactions across the platform.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={transactions || []}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
