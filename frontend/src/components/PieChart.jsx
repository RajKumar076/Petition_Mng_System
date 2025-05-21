import React, { useState, useEffect } from "react";
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieChart = ({ department }) => {
  const [data, setData] = useState([]);
  const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#2196F3"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/department-pie/${department}/`);
        const pieData = await response.json();
        // pieData should already be in the format: [{ name: "Solved", value: ... }, ...]
        setData(pieData);
      } catch (err) {
        console.error("Error fetching pie chart data:", err);
      }
    };

    fetchData();
  }, [department]);

  // Custom label to show percentage inside the pie
  const renderCustomizedLabel = ({ percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if the value is not zero
    return data[index] && data[index].value > 0 ? (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <RePieChart width={200} height={200}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={60}
        dataKey="value"
        label={renderCustomizedLabel}
        labelLine={false}
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