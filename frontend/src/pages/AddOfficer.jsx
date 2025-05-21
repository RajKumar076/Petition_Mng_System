import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import axios from "axios";

const AddOfficer = () => {
  const [officer, setOfficer] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/departments/");
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfficer({ ...officer, [name]: name === "department" ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }
      const response = await fetch("http://127.0.0.1:8000/api/add-officer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(officer),
      });
      if (response.ok) {
        alert("Officer added successfully!");
        setOfficer({ name: "", email: "", department: "", password: "" });
      } else {
        const err = await response.json();
        console.error("Server Error:", err);
        alert("Failed to add officer");
      }
    } catch (error) {
      console.error("Error adding officer:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <div
        className="container"
        style={{
          maxWidth: "700px",
          margin: "50px auto",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "32px 24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#9352dd",
            marginBottom: "32px",
            letterSpacing: "1px",
          }}
        >
          Add Officer
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label" style={{ fontWeight: 500 }}>
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={officer.name}
              onChange={handleChange}
              required
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={officer.email}
              onChange={handleChange}
              required
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={officer.password}
              onChange={handleChange}
              required
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="department" className="form-label" style={{ fontWeight: 500 }}>
              Department
            </label>
            <select
              className="form-control"
              name="department"
              value={officer.department}
              onChange={handleChange}
              required
              style={{ borderRadius: "8px" }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              // background: "#9352dd",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1.1rem",
              padding: "10px 0",
              marginTop: "18px",
              letterSpacing: "1px",
            }}
          >
            Add Officer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOfficer;