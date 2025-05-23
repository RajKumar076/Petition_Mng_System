import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";

const Inventory = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
  const fetchGrievances = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/all-grievances/");
      const data = await response.json();
      setGrievances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching grievances:", error);
      setGrievances([]);
    }
  };

  fetchGrievances();
}, []);

  return (
    <div>
      <Header />
      <div
        className="container-fluid mt-4"
        style={{
          minHeight: "95vh",
          margin: "auto",
          padding: "10px",
        }}
      >
        <h2
          className="mb-4"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#9352dd",
            letterSpacing: "1px",
          }}
        >
          All Grievances
        </h2>
        <table
          className="table table-bordered table-hover"
          style={{
            borderRadius: "18px",
            fontSize: "1.2rem",
            tableLayout: "fixed",
            marginBottom: 0,
            background: "#fff",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date Submitted</th>
              <th style={thStyle}>Date Resolved</th>
              <th style={thStyle}>Department</th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((grievance, index) => (
              <tr key={index} style={{ textAlign: "center", height: "56px" }}>
                <td>{grievance.id}</td>
                <td>{grievance.title}</td>
                <td>{grievance.description}</td>
                <td>{grievance.priority || "-"}</td>
                <td>{grievance.status}</td>
                <td>{grievance.date_submitted ? new Date(grievance.date_submitted).toLocaleDateString() : "-"}</td>
                <td>{grievance.date_resolved ? new Date(grievance.date_resolved).toLocaleDateString() : "-"}</td>
                <td>{grievance.department}</td>
              </tr>
            ))}
            {grievances.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">
                  No grievances found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = {
  backgroundColor: "#9352dd",
  color: "#fff",
  textAlign: "center",
  fontSize: "1.35rem",
  height: "60px",
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundClip: "padding-box",
};

export default Inventory;