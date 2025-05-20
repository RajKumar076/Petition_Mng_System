import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const SubmitGrievance = () => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    pincode: "",
    incident_date: "",
    document: null,
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      document: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/submit-petition/${departmentName}/`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Petition submitted successfully.");
      navigate("/user-dashboard"); // or wherever appropriate
    } catch (error) {
      console.error(error);
      alert("Failed to submit grievance.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        <h2 className="text-center mb-4">
          Submit Grievance for <span className="text-primary">{departmentName}</span>
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label fw-semibold">Grievance Title</label>
            <input type="text" name="title" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea name="description" className="form-control" rows="4" onChange={handleChange} required></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <input type="text" name="address" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input type="text" name="phone" className="form-control" maxLength="15" onChange={handleChange} required />
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-semibold">Pincode</label>
            <input type="text" name="pincode" className="form-control" maxLength="6" onChange={handleChange} required />
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-semibold">Date of Incident</label>
            <input type="date" name="incident_date" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Upload Supporting Documents</label>
            <input type="file" name="document" className="form-control" onChange={handleFileChange} />
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="acknowledgement" required />
            <label className="form-check-label" htmlFor="acknowledgement">
              I confirm that the above information is accurate.
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitGrievance;
