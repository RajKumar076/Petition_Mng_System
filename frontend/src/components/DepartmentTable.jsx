import React, { useState, useEffect } from "react";

const DepartmentTable = ({ department, limit = 10 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/complaints/${id}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        }
      );
      if (response.ok) {
        setData((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, status: newStatus } : row
          )
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
    <div
      className="table-responsive w-100 rounded"
      style={{
        maxHeight: "500px",
        overflowY: "auto",
        overflowX: "unset", // Remove horizontal scroll
        background: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        borderRadius: "18px",
        padding: "10px",
      }}
    >
        <table className="table table-bordered table-hover align-middle text-center mb-0">
          <thead>
  <tr>
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
      Address
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
      Pincode
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
      Phone
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
      Date
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
      File Attached
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
      Actions
    </th>
  </tr>
</thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10}>Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={10}>No complaints found.</td>
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
                        <a href={proof_file} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        "No"
                      )}
                    </td>
                    <td className={getStatusColor(status)}>{status}</td>
<td>
  <span
    className="me-3"
    style={{
      cursor: status === "solved" ? "not-allowed" : "pointer",
      opacity: status === "solved" ? 0.5 : 1,
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
    onClick={() => status !== "solved" && handleStatusUpdate(id, "solved")}
    title="Mark as Solved"
    onMouseEnter={e => {
      const tooltip = e.currentTarget.querySelector(".solved-tooltip");
      if (tooltip) tooltip.style.visibility = "visible";
    }}
    onMouseLeave={e => {
      const tooltip = e.currentTarget.querySelector(".solved-tooltip");
      if (tooltip) tooltip.style.visibility = "hidden";
    }}
  >
    <span role="img" aria-label="Solved">&#10003;</span>
    <span
      style={{
        visibility: "hidden",
        background: "#222",
        color: "#fff",
        borderRadius: "4px",
        padding: "2px 8px",
        position: "absolute",
        zIndex: 2,
        left: "110%",
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
        fontSize: "0.95rem",
      }}
      className="solved-tooltip"
    >
      Solved
    </span>
  </span>
  <span
    style={{
      cursor: status === "rejected" ? "not-allowed" : "pointer",
      opacity: status === "rejected" ? 0.5 : 1,
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
    onClick={() => status !== "rejected" && handleStatusUpdate(id, "rejected")}
    title="Mark as Rejected"
    onMouseEnter={e => {
      const tooltip = e.currentTarget.querySelector(".rejected-tooltip");
      if (tooltip) tooltip.style.visibility = "visible";
    }}
    onMouseLeave={e => {
      const tooltip = e.currentTarget.querySelector(".rejected-tooltip");
      if (tooltip) tooltip.style.visibility = "hidden";
    }}
  >
    <span role="img" aria-label="Rejected">&#10007;</span>
    <span
      style={{
        visibility: "hidden",
        background: "#222",
        color: "#fff",
        borderRadius: "4px",
        padding: "2px 8px",
        position: "absolute",
        zIndex: 2,
        left: "110%",
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
        fontSize: "0.95rem",
      }}
      className="rejected-tooltip"
    >
      Rejected
    </span>
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

export default DepartmentTable;