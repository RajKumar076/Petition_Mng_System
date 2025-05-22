import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PieChart from "../components/PieChart";
import { useNavigate } from "react-router-dom";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const department = "all"; // Special flag to indicate total from all departments

  // State to hold department names fetched from backend
  const [departments, setDepartments] = useState([]);
  const [lineGraphData, setLineGraphData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [loadingGraphs, setLoadingGraphs] = useState(true);

  useEffect(() => {
    // Fetch department list from backend
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/departments/");
        const data = await response.json();
        setDepartments(data.map((dept) => dept.name));
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Fetch line graph and bar graph data for admin (all departments)
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
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          zIndex: "1000",
        }}
      >
        <Header />
      </div>

      <div className="d-flex" style={{ marginTop: "56px" }}>
        {/* Sidebar */}
        <div
          className="bg-dark text-white p-3 shadow"
          style={{
            width: "250px",
            height: "calc(100vh - 56px)",
            position: "fixed",
            top: "56px",
            overflowY: "auto",
          }}
        >
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button
                className="btn btn-link text-white w-100 text-start text-decoration-none"
                onClick={() => navigate("/admindashboard")}
              >
                <i className="bi bi-house-door me-2"></i> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="btn btn-link text-white w-100 text-start text-decoration-none"
                onClick={() => navigate("./add-category")}
              >
                <i className="bi bi-folder-plus me-2"></i> Add Category
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="btn btn-link text-white w-100 text-start text-decoration-none"
                onClick={() => navigate("./add-officer")}
              >
                <i className="bi bi-person-plus me-2"></i> Add Officer
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="btn btn-link text-white w-100 text-start text-decoration-none"
                onClick={() => navigate("./view-officers")}
              >
                <i className="bi bi-people me-2"></i> View Officers
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="btn btn-link text-white w-100 text-start text-decoration-none"
                onClick={() => navigate("./view-users")}
              >
                <i className="bi bi-person me-2"></i> View Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className="btn btn-link text-white w-100 text-start text-decoration-none"
                onClick={() => navigate("./inventory")}
              >
                <i className="bi bi-file-earmark-text me-2"></i> View Grievance
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="container-fluid mt-4" style={{ marginLeft: "250px" }}>
          {/* Overall Stats */}
          <StatsBoxes department={department} />

          {/* Graphs */}
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  {/* Pass department="all" to show overall data */}
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

          <div className="row">
            {departments.map((dept) => (
              <div
                key={dept}
                className="col-md-3 mb-4"
                onClick={() => navigate(`./department/${dept}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card shadow-sm h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title text-primary">{dept} Department</h5>
                    {/* Pass department name to PieChart to fetch and analyze data for that department */}
                    <PieChart department={dept} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;