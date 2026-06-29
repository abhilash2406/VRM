import React, { useEffect } from 'react';
import NavBar from '../Shared/NavBar';
import { useAllTransactions } from '../../hooks/queries/useTransactionQueries';
import AppDataTable from '../Shared/AppDataTable';
import NotFound from '../NotFound';
import { exportToCSV } from '../../utils/exportUtils';
import TablePanelHeader from '../Shared/TablePanelHeader';

const Transactions = () => {
  const { data: transactions } = useAllTransactions();

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
          <TablePanelHeader 
            searchPlaceholder="Search transactions..."
            onExport={() => exportToCSV(transactions, 'Transactions')}
          />
          <AppDataTable
            columns={columns}
            data={transactions || []}

            noDataComponent={customNoData}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
