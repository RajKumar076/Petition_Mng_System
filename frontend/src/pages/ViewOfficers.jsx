import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const ViewOfficers = () => {
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    // Fetch officers from backend API
    const fetchOfficers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/officers/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOfficers(response.data);
      } catch (error) {
        console.error("Error fetching officers:", error);
      }
    };

    fetchOfficers();
  }, []);

  // Group officers by department and sort departments alphabetically
  const officersByDept = officers.reduce((acc, officer) => {
    const dept = officer.department || "Others";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(officer);
    return acc;
  }, {});

  const sortedDepartments = Object.keys(officersByDept).sort();

  // Remove officer handler (dummy, replace with backend call)
  const handleRemove = async (officerId) => {
  const confirmDelete = window.confirm("Are you sure you want to remove this officer?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("access_token");

  try {
    await axios.delete(
      `http://127.0.0.1:8000/api/admin/officer/delete/${officerId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Refresh UI
    setOfficers((prev) => prev.filter((officer) => officer.id !== officerId));
  } catch (error) {
    console.error("Failed to delete officer:", error);
    alert("Error deleting officer");
  }
};

  return (
    <div>
      <Header />
      <div className="container-fluid mt-4">
        <h2
          className="mb-4"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#444",
            letterSpacing: "1px",
          }}
        >
          All Officers
        </h2>
        {sortedDepartments.map((dept) => (
          <div key={dept} className="mb-5">
            <div
              style={{
                backgroundColor: "#9352dd",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.2rem",
                padding: "10px 20px",
                borderRadius: "6px",
                marginBottom: "20px",
                marginTop: "30px",
                letterSpacing: "1px",
                textAlign: "center",
              }}
            >
              {dept}
            </div>
            <div className="row">
              {officersByDept[dept].map((officer, index) => (
                <div
                  key={officer.id || index}
                  className="col-xl-2 col-lg-2 col-md-3 col-sm-6 mb-4 d-flex"
                  style={{ minWidth: "250px", maxWidth: "100%" }}
                >
                  <div
                    className="card shadow-sm flex-fill"
                    style={{
                      minHeight: "230px",
                      fontSize: "1.1rem",
                      padding: "10px",
                    }}
                  >
                    <div className="card-body text-center">
                      <p className="card-text" style={{ fontWeight: "bold" }}>
                        Name:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {officer.username}
                        </span>
                      </p>
                      <p className="card-text" style={{ fontWeight: "bold" }}>
                        Department:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {officer.department}
                        </span>
                      </p>
                      <p className="card-text" style={{ fontWeight: "bold" }}>
                        Email:{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {officer.email}
                        </span>
                      </p>
                      <button
                        className="btn btn-danger mt-3"
                        style={{
                          color: "#fff",
                          backgroundColor: "#dc3545",
                          borderColor: "#dc3545",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleRemove(officer.id)}
                      >
                        <FaTrash
                          style={{ marginRight: "6px", marginBottom: "2px" }}
                        />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {officers.length === 0 && (
          <div className="text-center mt-5">No officers found.</div>
        )}
      </div>
    </div>
  );
};

export default ViewOfficers;