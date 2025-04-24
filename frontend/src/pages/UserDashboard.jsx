import React from "react";
import Header from "../components/Header";
import ComplaintForm from "../components/ComplaintForm";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";

const UserDashboard = () => {
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

        {/* Complaint Form */}
        <div className="card shadow-sm mt-4 mb-5">
          <div className="card-body">
            <h4 className="mb-3 text-center text-primary">Submit a Complaint</h4>
            <ComplaintForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
