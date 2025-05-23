import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
import DepartmentTable from "../components/DepartmentTable";

const OfficerDashboard = () => {
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [lineGraphData, setLineGraphData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [loadingGraphs, setLoadingGraphs] = useState(true);

  // Fetch officer profile and department
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/profile/?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMsg(errorData.detail || "Could not load profile.");
          setDepartment("");
        } else {
          const data = await response.json();
          const deptName =
            typeof data.department === "object" && data.department !== null
              ? data.department.name
              : data.department;
          setDepartment(deptName || "");
          localStorage.setItem("department", deptName || "");
          setErrorMsg("");
        }
      } catch (err) {
        setDepartment("");
        setErrorMsg("Network error or server not reachable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch graphs for officer's department
  useEffect(() => {
    if (!department) return;
    const fetchGraphs = async () => {
      setLoadingGraphs(true);
      try {
        const token = localStorage.getItem("access_token");
        const [lineRes, barRes] = await Promise.all([
          fetch(
            `http://127.0.0.1:8000/api/line-graph-data/?department=${encodeURIComponent(department)}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              credentials: "include",
            }
          ),
          fetch(
            `http://127.0.0.1:8000/api/bar-graph-data/?department=${encodeURIComponent(department)}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              credentials: "include",
            }
          ),
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
  }, [department]);

  if (loading) {
    return (
      <div>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div>{errorMsg}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {/* Department Name Centered Below Header */}
      {department && (
        <div style={{ textAlign: "center", fontWeight: "bolder", fontSize: "2rem", color: "#9352dd", marginTop: "10px" }}>
          {department} Department
        </div>
      )}
      <div className="container-fluid mt-4">
        {/* Stats Boxes */}
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

        {/* Table */}
        <div className="row">
          <div className="col-12 mb-4 bg-white card shadow-sm">
            <DepartmentTable department={department} limit={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;