import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";

const StatusPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user complaint history based on username from localStorage
    const fetchHistory = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(
          `http://127.0.0.1:8000/api/complaints/history/?username=${encodeURIComponent(
            username
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          setHistory([]);
        }
      } catch (err) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <Header />
      <div className="container-fluid mt-5">
        {/* History Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="card shadow-sm p-4">
              <h2
                className="mb-4 text-center"
                style={{ color: "#444", fontWeight: "bolder" }}
              >
                History
              </h2>
              <div className="table-responsive">
                <table
                  className="table table-bordered align-middle"
                  style={{
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                  }}
                >
                  <thead className="table-light">
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
                        Grievance ID
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
                        Grievance Title
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
                        Date of Submit
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
                        Date of Resolved
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
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          Loading...
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No complaints found.
                        </td>
                      </tr>
                    ) : (
                      history.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.title}</td>
                          <td>{item.date || item.date_submitted || "N/A"}</td>
                          <td>{item.status}</td>
                          <td>
                            {item.date_of_resolved ||
                              item.date_resolved ||
                              "N/A"}
                          </td>
                          <td>{item.remarks || "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
