import React, { useState } from "react";

const AddCategory = () => {
  const [category, setCategory] = useState({
    departmentName: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const departmentFileName = `${category.departmentName.toLowerCase()}.json`;

      // Simulate creating a new JSON file for the department
      const newDepartmentData = [];
      console.log(`Creating file: /data/${departmentFileName}`);
      console.log("Initial Data:", newDepartmentData);

      // Simulate saving the file (mock API or local storage)
      alert(`Department "${category.departmentName}" added successfully!`);

      // Reset the form
      setCategory({ departmentName: "", description: "" });
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="departmentName" className="form-label">
            Department Name
          </label>
          <input
            type="text"
            className="form-control"
            id="departmentName"
            name="departmentName"
            value={category.departmentName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={category.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddCategory;