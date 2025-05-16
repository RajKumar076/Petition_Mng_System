import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";

const UserDashboard = () => {
  const navigate = useNavigate();
  const department = "all"; // Special flag to indicate total from all departments

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
                <LineGraph department={department} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <BarGraph department={department} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Columns */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h4 style={{color:"#9352dd"}}>To Complain</h4>
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
                <h4 style={{color:"#9352dd"}}>Grievance History</h4>
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
    </div>
  );
};

export default UserDashboard;