import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
import DepartmentTable from "../components/DepartmentTable";
import { useNavigate } from "react-router-dom";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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

          if (data.department) {
            const deptName =
              typeof data.department === "object" && data.department !== null
                ? data.department.name
                : data.department;
            setDepartment(deptName || "");
            localStorage.setItem("department", deptName || "");
          }
          // Handle department as object or string
          if (typeof data.department === "object" && data.department !== null) {
            setDepartment(data.department.name || "");
          } else {
            setDepartment(data.department || "");
          }
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
      <div className="container-fluid mt-4">
        {/* Stats Boxes */}
        <StatsBoxes department={department} />

        {/* Graphs */}
        <div className="row mt-4">
          <div
            className="col-md-6 mb-4"
            onClick={() => navigate(`./department/${department}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card shadow-sm">
              <div className="card-body">
                <LineGraph department={department} />
              </div>
            </div>
          </div>
          <div
            className="col-md-6 mb-4"
            onClick={() => navigate(`./department/${department}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card shadow-sm">
              <div className="card-body">
                <BarGraph department={department} />
              </div>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="row">
          <div className="col-md-6 mb-4 bg-white card shadow-sm">
            <DepartmentTable department={department} limit={5} />
          </div>
          <div className="col-md-6 mb-4 bg-white card shadow-sm">
            <DepartmentTable department={department} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
