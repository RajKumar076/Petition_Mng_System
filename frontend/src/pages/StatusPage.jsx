import React, { useState } from "react";

const StatusPage = () => {
  const [id, setId] = useState("");
  const [complaintName, setComplaintName] = useState("");
  const [statusDetails, setStatusDetails] = useState(null);

  const handleViewStatus = async () => {
    try {
      // Fetch all JSON data
      const departments = ["health", "education", "transport", "sanitation"];
      let allData = [];

      for (const dept of departments) {
        const response = await fetch(`/data/${dept}.json`);
        const data = await response.json();
        allData = [...allData, ...data];
      }

      console.log("All Data:", allData); // Log all data for debugging

      // Find the complaint by ID and name
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
      console.error("Error fetching data:", err);
      setStatusDetails({ error: "An error occurred while fetching data." });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Complaint Status</h2>
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
              View Status
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
  );
};

export default StatusPage;