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
} from 'recharts';

const BarGraph = ({ trips }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Group the trips by month
    const tripsByMonth = trips?.reduce((acc, trip) => {
      const month = moment(trip?.date).format('MMMM');
      acc[month] = acc[month] ? acc[month] + 1 : 1;
      return acc;
    }, {});

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
    <div className='mt-5'>
      <h2>Number of Trips per Month</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" domain={moment.months()} />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="no_of_trips" fill="black" />
      </BarChart>
    </div>
  );
};

export default BarGraph;
