import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { name: "Jan", Solved: 5, Unsolved: 3 },
  { name: "Feb", Solved: 10, Unsolved: 2 },
  { name: "Mar", Solved: 7, Unsolved: 4 },
];

const LineGraph = ({ department }) => {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-center font-semibold mb-2">Monthly Trend</h3>
      <LineChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Solved" stroke="#4CAF50" />
        <Line type="monotone" dataKey="Unsolved" stroke="#F44336" />
      </LineChart>
    </div>
  );
};

export default LineGraph;
