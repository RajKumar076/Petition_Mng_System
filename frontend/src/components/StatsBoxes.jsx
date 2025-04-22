import React, { useState, useEffect } from "react";

const StatsBoxes = ({ department }) => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    solvedComplaints: 0,
    pendingComplaints: 0,
    rejectedComplaints: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const departments = ["health", "education", "transport", "sanitation"];
      let combinedData = [];

      if (department === "all") {
        // Fetch data from all departments
        for (const dept of departments) {
          try {
            const response = await fetch(`/data/${dept}.json`);
            const data = await response.json();
            combinedData = [...combinedData, ...data];
          } catch (err) {
            console.error(`Error loading data for ${dept}:`, err);
          }
        }
      } else {
        // Fetch data for a specific department
        try {
          const response = await fetch(`/data/${department.toLowerCase()}.json`);
          combinedData = await response.json();
        } catch (err) {
          console.error(`Error loading data for ${department}:`, err);
        }
      }

      // Calculate statistics
      const totalComplaints = combinedData.length;
      const solvedComplaints = combinedData.filter((c) => c.status === "Solved").length;
      const pendingComplaints = combinedData.filter((c) => c.status === "Pending").length;
      const rejectedComplaints = combinedData.filter((c) => c.status === "Rejected").length;

      setStats({
        totalComplaints,
        solvedComplaints,
        pendingComplaints,
        rejectedComplaints,
      });
    };

    fetchData();
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