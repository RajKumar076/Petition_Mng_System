import React, { useState, useEffect } from "react";
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieChart = ({ department }) => {
  const [data, setData] = useState([]);
  const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#2196F3"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/data/${department.toLowerCase()}.json`);
        const departmentData = await response.json();

        // Calculate the counts for each status
        const solved = departmentData.filter((item) => item.status === "Solved").length;
        const pending = departmentData.filter((item) => item.status === "Pending").length;
        const rejected = departmentData.filter((item) => item.status === "Rejected").length;
        const unsolved = departmentData.filter((item) => item.status === "Unsolved").length;

        // Set the data for the pie chart
        setData([
          { name: "Solved", value: solved },
          { name: "Pending", value: pending },
          { name: "Rejected", value: rejected },
          { name: "Unsolved", value: unsolved },
        ]);
      } catch (err) {
        console.error("Error fetching pie chart data:", err);
      }
    };

    fetchData();
  }, [department]);

  return (
    <RePieChart width={200} height={200}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={60}
        dataKey="value"
        label
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </RePieChart>
  );
};

export default PieChart;