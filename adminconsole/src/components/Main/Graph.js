import React from 'react';
import { Line } from 'react-chartjs-2';

const Graph = ({ data }) => {
  const graphData = {
    labels: ['week 1', 'week 2', 'week 3', 'week 4', 'week 5'],
    datasets: [
      {
        label: 'Trips Taken',
        data: data,
        fill: false,
        borderColor: 'Red',
        borderWidth: 2,
        lineTension: 0.2,
      },
    ],
  };

  return (
    <div className="graph-container">
      <Line data={graphData} />
    </div>
  );
};

export default Graph;
