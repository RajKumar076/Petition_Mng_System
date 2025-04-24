import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { name: "Week 1", Rejected: 2, Pending: 5 },
  { name: "Week 2", Rejected: 1, Pending: 3 },
  { name: "Week 3", Rejected: 4, Pending: 2 },
];

const BarGraph = ({ department }) => {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-center font-semibold mb-2">Weekly Insights</h3>
      <BarChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Rejected" fill="#F44336" />
        <Bar dataKey="Pending" fill="#FFC107" />
      </BarChart>
    </div>
  );
};

export default BarGraph;
