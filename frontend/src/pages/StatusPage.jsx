import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";

const getUserEmail = () => {
  // Replace this with your actual logic to get the logged-in user's email
  return localStorage.getItem("userEmail") || "";
};

const StatusPage = () => {
  const [id, setId] = useState("");
  const [complaintName, setComplaintName] = useState("");
  const [statusDetails, setStatusDetails] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch user complaint history based on email
    const fetchHistory = async () => {
      try {
        const email = getUserEmail();
        // Example: Fetch from your backend API
        const response = await fetch(`/api/complaints/history?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

  const handleViewStatus = async () => {
    try {
      const departments = ["health", "education", "transport", "sanitation"];
      let allData = [];

      for (const dept of departments) {
        const response = await fetch(`/data/${dept}.json`);
        const data = await response.json();
        allData = [...allData, ...data];
      }

      const complaint = allData.find(
        (item) =>
          item.id === parseInt(id) &&
          item.title.toLowerCase() === complaintName.toLowerCase()
      );

      if (complaint) {
        setStatusDetails(complaint);
      } else {
        setStatusDetails({ error: "Complaint not found." });
      }
    } catch (err) {
      setStatusDetails({ error: "An error occurred while fetching data." });
    }
  };

  return (
    <div>
    <Header />
    <div className="container-fluid mt-5">
      {/* History Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-center" style={{ color: "#9352dd" }}>History</h2>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Complaint ID</th>
                    <th>Complaint Title</th>
                    <th>Date of Submit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No complaints found.</td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.date || item.date_of_submit || "N/A"}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Status Section */}
      <h2 className="text-center mb-4" style={{ color: "#9352dd" }}>Track Complaint Status</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <div className="form-group mb-3">
              <label htmlFor="id">Complaint ID</label>
              <input
                type="number"
                id="id"
                className="form-control"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Complaint ID"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="complaintName">Complaint Name</label>
              <input
                type="text"
                id="complaintName"
                className="form-control"
                value={complaintName}
                onChange={(e) => setComplaintName(e.target.value)}
                placeholder="Enter Complaint Name"
                required
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleViewStatus}
            >
              Track Status
            </button>
          </div>
        </div>
      </div>

      {statusDetails && (
        <div className="mt-4 text-center">
          {statusDetails.error ? (
            <p className="text-danger">{statusDetails.error}</p>
          ) : (
            <div className="card shadow-sm p-4">
              <h4>Complaint Details</h4>
              <p><strong>ID:</strong> {statusDetails.id}</p>
              <p><strong>Title:</strong> {statusDetails.title}</p>
              <p><strong>Status:</strong> {statusDetails.status}</p>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default StatusPage;