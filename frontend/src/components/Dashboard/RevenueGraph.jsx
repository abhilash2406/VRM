import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const RevenueGraph = ({ transactions }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Group the transactions by month
    const revByMonth = Array.isArray(transactions) ? transactions.reduce((acc, tx) => {
      // Use date or createdAt
      const txDate = tx.date || tx.createdAt || new Date();
      const month = moment(txDate).format('MMMM');
      acc[month] = (acc[month] || 0) + (parseFloat(tx.amount) || 0);
      return acc;
    }, {}) : {};

    // Get an array of all months in order
    const allMonths = moment.months();

    // Convert the revByMonth object into an array of data
    const data = allMonths.map((month) => ({
      month,
      revenue: parseFloat((revByMonth[month] || 0).toFixed(2)),
    }));

    setData(data);
  }, [transactions]);

  return (
    <div className='mt-5' style={{ width: '100%', height: '350px' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#fff' }}>Revenue Analytics</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" domain={moment.months()} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', color: '#fff' }} 
            formatter={(value) => `$${value}`}
          />
          <Legend />
          <Area type="monotone" dataKey="revenue" stroke="#2ecc71" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueGraph;
