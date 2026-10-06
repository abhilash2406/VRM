import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BarGraph = ({ trips }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Group the trips by month
    const tripsByMonth = Array.isArray(trips) ? trips.reduce((acc, trip) => {
      const month = moment(trip?.date).format('MMMM');
      acc[month] = acc[month] ? acc[month] + 1 : 1;
      return acc;
    }, {}) : {};

    // Get an array of all months in order
    const allMonths = moment.months();

    // Convert the tripsByMonth object into an array of data, with a count of 0 for any month with no trips
    const data = allMonths.map((month) => ({
      month,
      no_of_trips: tripsByMonth[month] || 0,
    }));

    setData(data);
  }, [trips]);

  return (
    <div className='mt-5' style={{ width: '100%', height: '350px' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#fff' }}>Number of Trips per Month</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" domain={moment.months()} stroke="#94a3b8" />
          <YAxis domain={[0, 10]} stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 10, 51, 0.9)', border: 'none', color: '#fff' }} />
          <Legend />
          <Bar dataKey="no_of_trips" fill="#00D4FF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;
