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
    setOfficer({ ...officer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace this with your actual backend API endpoint
      const response = await fetch("http://127.0.0.1:8000/api/add-officer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add auth token if your endpoint is protected
          // "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({ ...officer, role: "officer" }),
      });

      if (response.ok) {
        alert("Officer added successfully!");
        setOfficer({ name: "", email: "", department: "", password: "" }); // Reset form
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
    <div>
      <Header />
    <div className="container mt-4">
      <h2 className="mb-4">Add Officer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
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
          />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={officer.password}
              onChange={handleChange}
              required
            />
          </div>
        {/* Department Dropdown */}
          <div className="mb-3">
            <label htmlFor="department" className="form-label">Department</label>
            <select className="form-control" name="department" value={officer.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

        <button type="submit" className="btn btn-primary">
          Add Officer
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddOfficer;