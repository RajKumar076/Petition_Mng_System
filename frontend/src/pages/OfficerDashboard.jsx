import React from "react";
import Header from "../components/Header";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
import DepartmentTable from "../components/DepartmentTable";
import { useNavigate } from "react-router-dom";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const department = "Transport";  // make it dynamic

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
            onClick={() => navigate(`/department/${department.toLowerCase()}`)}
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
            onClick={() => navigate(`/department/${department.toLowerCase()}`)}
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
