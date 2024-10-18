import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const BarChartComponent = ({ barChartData, colors }) => {
  // Check if barChartData is an array and not empty
  const isValidData = Array.isArray(barChartData) && barChartData.length > 0;

  if (!isValidData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Transaction Distribution</h2>
        <p>No data available for the chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Transaction Distribution</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="range" 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#666' }}
            />
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#666' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                border: '1px solid #cccccc',
                borderRadius: '4px',
                padding: '10px'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar 
              dataKey="count" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={true} 
              animationBegin={100} 
              animationDuration={1500} 
              animationEasing="ease-in-out"
            >
              {barChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;