import React from "react";
import Header from "../components/Header";
import PieChart from "../components/PieChart";
import { useNavigate } from "react-router-dom";

const departments = ["Health", "Education", "Transport", "Sanitation"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="container-fluid mt-4">
        <div className="row">
          {departments.map((dept) => (
            <div
              key={dept}
              className="col-md-3 mb-4"
              onClick={() => navigate(`/department/${dept.toLowerCase()}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{dept} Department</h5>
                  <PieChart department={dept} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
