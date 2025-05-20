import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";

const AddCategory = () => {
  const [category, setCategory] = useState({
    departmentName: "",
    description: "",
    image_url: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending:", {
      name: category.departmentName,
      description: category.description,
      image_url: category.image_url,
    });
    try {
      const response = await axios.post("http://localhost:8000/api/departments/", {
        name: category.departmentName,
        description: category.description,
        image_url: category.image_url,
      },
    {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert(`Department "${category.departmentName}" added successfully!`);
      } else {
        alert("Failed to add department.");
      }

      // Reset form
      setCategory({ departmentName: "", description: "", image_url: "" });
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Failed to add department");
    }
  };

  return (
    <div>
    <Header />
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "90vh",
        // backgroundColor: "#f2f2f2",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        className="p-4"
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="mb-4 text-center" style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#9352dd",
            letterSpacing: "1px",
          }}>Add New Department</h2>
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

          <div className="mb-3">
            <label htmlFor="image_url" className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              id="image_url"
              name="image_url"
              value={category.image_url}
              onChange={handleChange}
              required
            />
          </div>

          {category.image_url && (
            <div className="mb-3 text-center">
              <label className="form-label">Image Preview:</label>
              <div>
                <img
                  src={encodeURI(category.image_url)}
                  alt="Department Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "10px",
                    border: "1px solid #ccc"
                  }}
                />
              </div>
            </div>
          )}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Add Department
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddCategory;
