import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
import DepartmentTable from "../components/DepartmentTable";
import axios from "axios";

const OfficerDashboard = () => {
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [lineGraphData, setLineGraphData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [loadingGraphs, setLoadingGraphs] = useState(true);

  // For high-priority petitions table
  const [petitions, setPetitions] = useState([]);
  const [petitionsLoading, setPetitionsLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  // Fetch officer profile and department
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/profile/?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMsg(errorData.detail || "Could not load profile.");
          setDepartment("");
        } else {
          const data = await response.json();
          const deptName =
            typeof data.department === "object" && data.department !== null
              ? data.department.name
              : data.department;
          setDepartment(deptName || "");
          localStorage.setItem("department", deptName || "");
          setErrorMsg("");
        }
      } catch (err) {
        setDepartment("");
        setErrorMsg("Network error or server not reachable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch graphs for officer's department
  useEffect(() => {
    if (!department) return;
    const fetchGraphs = async () => {
      setLoadingGraphs(true);
      try {
        const token = localStorage.getItem("access_token");
        const [lineRes, barRes] = await Promise.all([
          fetch(
            `http://127.0.0.1:8000/api/line-graph-data/?department=${encodeURIComponent(department)}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              credentials: "include",
            }
          ),
          fetch(
            `http://127.0.0.1:8000/api/bar-graph-data/?department=${encodeURIComponent(department)}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              credentials: "include",
            }
          ),
        ]);
        const lineData = await lineRes.json();
        const barData = await barRes.json();
        setLineGraphData(lineData);
        setBarGraphData(barData);
      } catch (err) {
        setLineGraphData([]);
        setBarGraphData([]);
      }
      setLoadingGraphs(false);
    };
    fetchGraphs();
  }, [department]);

  // Fetch high-priority petitions for officer's department
  const fetchPetitions = async () => {
    setPetitionsLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/officer/petitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPetitions(res.data);
    } catch (err) {
      setPetitions([]);
      console.error(err);
    }
    setPetitionsLoading(false);
  };

  useEffect(() => {
    if (department) fetchPetitions();
    // eslint-disable-next-line
  }, [department]);

  // Handle petition status update
  const handleUpdate = async (id, status, remarks) => {
  const token = localStorage.getItem("access_token");
  setUpdating((prev) => ({ ...prev, [id]: { ...prev[id], loading: true } }));
  try {
    // Only allow "solved" or "rejected" as valid status values
    if (!["solved", "rejected"].includes(status)) {
      alert("Please select a valid status (Solved or Rejected).");
      setUpdating((prev) => ({ ...prev, [id]: { ...prev[id], loading: false } }));
      return;
    }
    await axios.post(
      `http://127.0.0.1:8000/api/officer/petitions/update/${id}`,
      { status, remarks },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPetitions();
  } catch (err) {
    alert("Failed to update petition.");
    console.error(err);
  }
  setUpdating((prev) => ({ ...prev, [id]: { ...prev[id], loading: false } }));
};

  if (loading) {
    return (
      <div>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div>{errorMsg}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container-fluid mt-4">
        {/* Stats Boxes */}
        <StatsBoxes department={department} />

        {/* Graphs */}
        <div className="row mt-4">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {loadingGraphs ? (
                  <div>Loading weekly insights...</div>
                ) : (
                  <LineGraph department={department} data={lineGraphData} />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {loadingGraphs ? (
                  <div>Loading monthly trends...</div>
                ) : (
                  <BarGraph department={department} data={barGraphData} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="row">
          <div className="col-12 mb-4 bg-white card shadow-sm">
            <DepartmentTable department={department} limit={100} />
          </div>
        </div>

        {/* High Priority Petitions Table */}
        <div className="p-4 bg-gray-900 text-black min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Officer Dashboard - High Priority Petitions</h1>
          {petitionsLoading ? (
            <p>Loading...</p>
          ) : petitions.length === 0 ? (
            <p>No petitions found.</p>
          ) : (
            <table className="w-full border border-gray-700 text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Proof</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Sentiment</th>
                  <th>Action</th>
                  <th>Remarks</th>
                  <th>Submit</th>
                </tr>
              </thead>
              <tbody>
                {petitions.map((p) => (
                  <tr key={p.id} className="border-t border-gray-700">
                    <td>{p.id}</td>
                    <td>{p.title}</td>
                    <td>{p.description}</td>
                    <td>
                      {p.proof_file ? (
                        <a
                          href={p.proof_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400"
                        >
                          View
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td>{new Date(p.date_submitted).toLocaleDateString()}</td>
                    <td className="font-semibold text-red-500">{p.priority}</td>
                    <td>{p.sentiment}</td>
                    <td>
                      <select
                        className="text-black p-1 rounded"
                        onChange={(e) =>
                          setUpdating((prev) => ({
                            ...prev,
                            [p.id]: { ...prev?.[p.id], status: e.target.value },
                          }))
                        }
                        value={updating?.[p.id]?.status || ""}
                      >
                        <option value="">Select</option>
                        <option value="solved">Solved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="text-black p-1 rounded"
                        onChange={(e) =>
                          setUpdating((prev) => ({
                            ...prev,
                            [p.id]: { ...prev?.[p.id], remarks: e.target.value },
                          }))
                        }
                        value={updating?.[p.id]?.remarks || ""}
                        placeholder="Remarks"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleUpdate(
                            p.id,
                            updating?.[p.id]?.status || "",
                            updating?.[p.id]?.remarks || ""
                          )
                        }
                        className="bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                        disabled={updating?.[p.id]?.loading}
                      >
                        {updating?.[p.id]?.loading ? "Updating..." : "Update"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;