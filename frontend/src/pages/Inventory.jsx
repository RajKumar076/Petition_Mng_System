import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";

const Inventory = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
  const fetchGrievances = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/all-grievances/");
      const data = await response.json();
      setGrievances(data);
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
            // overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderTopLeftRadius: "18px",
                  backgroundColor: "#9352dd",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1.35rem",
                  height: "60px",
                  position: "sticky",
                  top: 0, // Stick to the very top of the viewport
                  zIndex: 10,
                  backgroundClip: "padding-box",
                }}
              >
                ID
              </th>
              <th
                style={{
                  backgroundColor: "#9352dd",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1.35rem",
                  height: "60px",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundClip: "padding-box",
                }}
              >
                Title
              </th>
              <th
                style={{
                  backgroundColor: "#9352dd",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1.35rem",
                  height: "60px",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundClip: "padding-box",
                }}
              >
                Description
              </th>
              <th
                style={{
                  backgroundColor: "#9352dd",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1.35rem",
                  height: "60px",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundClip: "padding-box",
                }}
              >
                Status
              </th>
              <th
                style={{
                  borderTopRightRadius: "18px",
                  backgroundColor: "#9352dd",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1.35rem",
                  height: "60px",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundClip: "padding-box",
                }}
              >
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((grievance, index) => (
              <tr key={index} style={{ textAlign: "center", height: "56px" }}>
                <td>{grievance.id}</td>
                <td>{grievance.title}</td>
                <td>{grievance.description}</td>
                <td>{grievance.status}</td>
                <td>{grievance.department}</td>
              </tr>
            ))}
            {grievances.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
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

export default Inventory;