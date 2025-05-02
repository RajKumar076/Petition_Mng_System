import React, { useState } from "react";

const AddOfficer = () => {
  const [officer, setOfficer] = useState({
    name: "",
    email: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfficer({ ...officer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch existing data from sampleData.json
      const response = await fetch("/data/sampleData.json");
      const data = await response.json();

      // Add the new officer to the data
      const updatedData = [...data, { ...officer, role: "officer" }];

      // Simulate saving to sampleData.json (mock API or local storage)
      console.log("Updated Data:", updatedData);

      alert("Officer added successfully!");
      setOfficer({ name: "", email: "", department: "" }); // Reset form
    } catch (error) {
      console.error("Error adding officer:", error);
    }
  };

  return (
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
          <label htmlFor="department" className="form-label">
            Department
          </label>
          <select
            className="form-control"
            id="department"
            name="department"
            value={officer.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Transport">Transport</option>
            <option value="Sanitation">Sanitation</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Officer
        </button>
      </form>
    </div>
  );
};

export default AddOfficer;