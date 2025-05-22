import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
import ChatBot from "../components/ChatBot";

const UserDashboard = () => {
  const navigate = useNavigate();
  const department = "all"; // Special flag to indicate total from all departments

  // State for graph data and loading
  const [lineGraphData, setLineGraphData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [loadingGraphs, setLoadingGraphs] = useState(true);

  useEffect(() => {
    // Fetch line graph and bar graph data for all departments (user)
    const fetchGraphs = async () => {
      setLoadingGraphs(true);
      try {
        const [lineRes, barRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/line-graph-data/", {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch("http://127.0.0.1:8000/api/bar-graph-data/", {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
        ]);
        const lineData = await lineRes.json();
        const barData = await barRes.json();
        setLineGraphData(lineData);
        setBarGraphData(barData);
      } catch (err) {
        setLineGraphData([]);
        setBarGraphData([]);
      }
      setLoadingGraphs(false);
    };
    fetchGraphs();
  }, []);

  return (
    <div>
      <Header />

      <div className="container-fluid mt-4">
        {/* Overall Stats */}
        <StatsBoxes department={department} />

        {/* Graphs */}
        <div className="row mt-4">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {loadingGraphs ? (
                  <div>Loading weekly insights...</div>
                ) : (
                  <LineGraph department={department} data={lineGraphData} />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {loadingGraphs ? (
                  <div>Loading monthly trends...</div>
                ) : (
                  <BarGraph department={department} data={barGraphData} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Columns */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h4 style={{ color: "#9352dd" }}>To Complain</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("./choosedepartment")}
                >
                  Go to Complain Form
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h4 style={{ color: "#9352dd" }}>Grievance History</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("./history")}
                >
                  Go to History Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default UserDashboard;