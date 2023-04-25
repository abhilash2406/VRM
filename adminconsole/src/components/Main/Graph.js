import React from 'react';
import { Line } from 'react-chartjs-2';
// import '../components/styles/dashboard.css';

const Graph = ({ data }) => {
  const graphData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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