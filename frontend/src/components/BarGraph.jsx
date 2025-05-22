import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Helper to generate last 6 months labels
function getLastSixMonths() {
  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

const BarGraph = ({ department, data }) => {
  const [barData, setBarData] = useState(data || []);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
  const months = getLastSixMonths();

  // If data is passed as prop (from AdminDashboard), use it directly
  if (data && Array.isArray(data)) {
    // Fill missing months with 0s
    const mapped = months.map((month) => {
      const found = data.find((item) => item.month === month || item.name === month);
      return {
        name: month,
        Rejected: found ? found.rejected ?? found.Rejected ?? 0 : 0,
        Pending: found ? found.pending ?? found.Pending ?? 0 : 0,
      };
    });
    setBarData(mapped);
    setLoading(false);
    return;
  }

  // Otherwise, fetch from backend (for officer/user dashboard)
  const fetchBarData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const url =
        department && department !== "all"
          ? `http://127.0.0.1:8000/api/bar-graph-data/?department=${encodeURIComponent(department)}`
          : "http://127.0.0.1:8000/api/bar-graph-data/";
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        credentials: "include",
      });
      const result = await response.json();
      // Fill missing months with 0s
      const mapped = months.map((month) => {
        const found = Array.isArray(result)
          ? result.find((item) => item.month === month || item.name === month)
          : null;
        return {
          name: month,
          Rejected: found ? found.rejected ?? found.Rejected ?? 0 : 0,
          Pending: found ? found.pending ?? found.Pending ?? 0 : 0,
        };
      });
      setBarData(mapped);
    } catch (err) {
      setBarData([]);
    }
    setLoading(false);
  };
  fetchBarData();
}, [department, data]);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-center font-semibold mb-2">Monthly Trends</h3>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <BarChart width={400} height={250} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Rejected" fill="#F44336" />
          <Bar dataKey="Pending" fill="#FFC107" />
        </BarChart>
      )}
    </div>
  );
};

export default BarGraph;