import React, { useState, useEffect } from "react";

const StatsBoxes = ({ department }) => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    solvedComplaints: 0,
    pendingComplaints: 0,
    rejectedComplaints: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        let url = "http://127.0.0.1:8000/api/stats/";
        if (department && department !== "all") {
          url += `?department=${encodeURIComponent(department)}`;
        }
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          credentials: "include",
        });
        const data = await response.json();
        setStats({
          totalComplaints: data.total_complaints || 0,
          solvedComplaints: data.solved_complaints || 0,
          pendingComplaints: data.pending_complaints || 0,
          rejectedComplaints: data.rejected_complaints || 0,
        });
      } catch (err) {
        setStats({
          totalComplaints: 0,
          solvedComplaints: 0,
          pendingComplaints: 0,
          rejectedComplaints: 0,
        });
      }
    };
    fetchStats();
  }, [department]);

  return (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h5 className="card-title text-primary">Total Complaints</h5>
            <h3 className="card-text">{stats.totalComplaints}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h5 className="card-title text-success">Solved Complaints</h5>
            <h3 className="card-text">{stats.solvedComplaints}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h5 className="card-title text-warning">Pending Complaints</h5>
            <h3 className="card-text">{stats.pendingComplaints}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h5 className="card-title text-danger">Rejected Complaints</h5>
            <h3 className="card-text">{stats.rejectedComplaints}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBoxes;