import React, { useState, useEffect } from "react";

const DepartmentTable = ({ department, limit = 10 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [updating, setUpdating] = useState({});
  const backendURL = "http://127.0.0.1:8000/";

  // Fetch complaints for the department from backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/department-complaints/?department=${department}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            credentials: "include",
          }
        );
        const complaints = await response.json();
        setData(complaints.slice(0, limit));
      } catch (err) {
        setData([]);
        console.error("Error loading department data:", err);
      }
      setLoading(false);
    };
    loadData();
  }, [department, limit]);

  // Function to get color based on status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "solved":
        return "text-success fw-bold";
      case "pending":
        return "text-warning fw-bold";
      case "rejected":
        return "text-danger fw-bold";
      case "unsolved":
        return "text-secondary fw-bold";
      default:
        return "text-info fw-bold";
    }
  };

  // Handle status update with remarks
  const handleStatusUpdate = async (id, newStatus) => {
    if (!remarks[id] || !remarks[id].trim()) {
      alert("Please fill in the remarks before submitting.");
      return;
    }
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem("access_token");
      const updateBody = { status: newStatus, remarks: remarks[id] };
      if (newStatus === "solved" || newStatus === "rejected") {
        updateBody.date_resolved = new Date().toISOString().slice(0, 19);
      }
      const response = await fetch(
        `http://127.0.0.1:8000/api/complaints/${id}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify(updateBody),
          credentials: "include",
        }
      );
      if (response.ok) {
        setData((prev) =>
          prev.map((row) =>
            row.id === id
              ? {
                  ...row,
                  status: newStatus,
                  date_resolved: updateBody.date_resolved,
                  remarks: remarks[id],
                }
              : row
          )
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
    }
    setUpdating((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="table-responsive w-100 rounded"
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          overflowX: "unset",
          background: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          borderRadius: "18px",
          padding: "10px",
        }}
      >
        <table className="table table-bordered table-hover align-middle text-center mb-0">
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Pincode</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Proof</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Sentiment</th>
              <th style={thStyle}>Remarks</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13}>Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={13}>No complaints found.</td>
              </tr>
            ) : (
              data.map(
                ({
                  id,
                  title,
                  description,
                  address,
                  pincode,
                  phone_number,
                  date_submitted,
                  proof_file,
                  status,
                  priority,
                  sentiment,
                  remarks: rowRemarks,
                }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{title}</td>
                    <td style={{ maxWidth: "240px", whiteSpace: "pre-line", wordBreak: "break-word" }}>{description}</td>
                    <td>{address}</td>
                    <td>{pincode}</td>
                    <td>{phone_number}</td>
                    <td>{date_submitted}</td>
                    <td>
                      {proof_file ? (
                        <a href={`${backendURL}${proof_file}`} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        "No"
                      )}
                    </td>
                    <td className={getStatusColor(status)}>{status}</td>
                    <td>{priority || "-"}</td>
                    <td>{sentiment || "-"}</td>
                    <td>
  <textarea
    className="form-control"
    style={{
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      resize: "vertical",
      height: "100%",
    }}
    rows={2}
    value={remarks[id] !== undefined ? remarks[id] : rowRemarks || ""}
    onChange={e =>
      setRemarks((prev) => ({
        ...prev,
        [id]: e.target.value,
      }))
    }
    disabled={updating[id]}
    placeholder="Enter remarks"
    required
  />
</td>
                    <td>
                      <span
                        className="me-3"
                        style={{
                          cursor: status === "solved" || updating[id] ? "not-allowed" : "pointer",
                          opacity: status === "solved" || updating[id] ? 0.5 : 1,
                          fontSize: "1.3rem",
                          position: "relative",
                          display: "inline-block",
                          background: "#28a745",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          marginRight: "8px",
                          transition: "background 0.2s",
                          border: "none",
                        }}
                        onClick={() =>
                          status !== "solved" && !updating[id] && handleStatusUpdate(id, "solved")
                        }
                        title="Mark as Solved"
                      >
                        <span role="img" aria-label="Solved">&#10003;</span>
                      </span>
                      <span
                        style={{
                          cursor: status === "rejected" || updating[id] ? "not-allowed" : "pointer",
                          opacity: status === "rejected" || updating[id] ? 0.5 : 1,
                          fontSize: "1.3rem",
                          position: "relative",
                          display: "inline-block",
                          background: "#dc3545",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          transition: "background 0.2s",
                          border: "none",
                        }}
                        onClick={() =>
                          status !== "rejected" && !updating[id] && handleStatusUpdate(id, "rejected")
                        }
                        title="Mark as Rejected"
                      >
                        <span role="img" aria-label="Rejected">&#10007;</span>
                      </span>
                    </td>
                  </tr>
                )
              )
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

export default DepartmentTable;