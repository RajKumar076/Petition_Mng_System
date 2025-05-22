import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import StatsBoxes from "../components/StatsBoxes";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
import DepartmentTable from "../components/DepartmentTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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

          if (data.department) {
            const deptName =
              typeof data.department === "object" && data.department !== null
                ? data.department.name
                : data.department;
            setDepartment(deptName || "");
            localStorage.setItem("department", deptName || "");
          }
          // Handle department as object or string
          if (typeof data.department === "object" && data.department !== null) {
            setDepartment(data.department.name || "");
          } else {
            setDepartment(data.department || "");
          }
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

  const [petitions, setPetitions] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchPetitions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/officer/petitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPetitions(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpdate = async (id, status, remarks) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/api/officer/petitions/update/${id}`,
        { status, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPetitions();
    } catch (err) {
      console.error(err);
    }
    setUpdating(null);
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

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
          <div
            className="col-md-6 mb-4"
            onClick={() => navigate(`./department/${department}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card shadow-sm">
              <div className="card-body">
                <LineGraph department={department} />
              </div>
            </div>
          </div>
          <div
            className="col-md-6 mb-4"
            onClick={() => navigate(`./department/${department}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card shadow-sm">
              <div className="card-body">
                <BarGraph department={department} />
              </div>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="row">
          <div className="col-md-14 mb-4 bg-white card shadow-sm">
            <DepartmentTable department={department} limit={5} />
          </div>
          {/* <div className="col-md-6 mb-4 bg-white card shadow-sm">
            <DepartmentTable department={department} limit={5} />
          </div> */}
        </div>

        <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Officer Dashboard - High Priority Petitions</h1>
      {loading ? (
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
                    defaultValue=""
                  >
                    <option value="">Select</option>
                    <option value="resolved">Resolved</option>
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
                  >
                    Update
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
