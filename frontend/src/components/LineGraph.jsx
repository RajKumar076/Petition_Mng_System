import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Helper to generate last 7 days labels
function getLastSevenDays() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return days;
}

const LineGraph = ({ department, data }) => {
  const [lineData, setLineData] = useState(data || []);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    const days = getLastSevenDays();

    // If data is passed as prop (from AdminDashboard), use it directly
    if (data && Array.isArray(data)) {
      // Fill missing days with 0s
      const mapped = days.map((day) => {
        const found = data.find((item) => item.date === day || item.name === day);
        return {
          name: day,
          Solved: found ? found.solved ?? found.Solved ?? 0 : 0,
          Unsolved: found ? found.unsolved ?? found.Unsolved ?? 0 : 0,
        };
      });
      setLineData(mapped);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from backend (for officer/user dashboard)
    const fetchLineData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const url =
          department && department !== "all"
            ? `http://127.0.0.1:8000/api/line-graph-data/?department=${encodeURIComponent(department)}`
            : "http://127.0.0.1:8000/api/line-graph-data/";
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          credentials: "include",
        });
        const result = await response.json();
        // Fill missing days with 0s
        const mapped = days.map((day) => {
          const found = Array.isArray(result)
            ? result.find((item) => item.date === day || item.name === day)
            : null;
          return {
            name: day,
            Solved: found ? found.solved ?? found.Solved ?? 0 : 0,
            Unsolved: found ? found.unsolved ?? found.Unsolved ?? 0 : 0,
          };
        });
        setLineData(mapped);
      } catch (err) {
        setLineData([]);
      }
      setLoading(false);
    };
    fetchLineData();
  }, [department, data]);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-center font-semibold mb-2">Weekly Insight</h3>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <LineChart width={400} height={250} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Solved" stroke="#4CAF50" />
          <Line type="monotone" dataKey="Unsolved" stroke="#F44336" />
        </LineChart>
      )}
    </div>
  );
};

export default LineGraph;