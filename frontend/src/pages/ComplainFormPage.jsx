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
    phone_number: "",
    incident_date: "",
    proof_file: "",
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
      proof_file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    try {
      const token = localStorage.getItem('access_token'); 

      await axios.post(
        `http://127.0.0.1:8000/api/submit-petition/${departmentName}/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${token}`,
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
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center py-4">
      {/* <div className="container" style={{ height: "710px", overflowY: "auto" }}> */}
        <h2 className="text-center mb-5 fw-bold">
          📝 Submit Grievance for <span className="text-primary">{departmentName}</span>
        </h2>
        
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-12">
            <div className="card shadow rounded-4 p-4 border-0">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Title */}
                <div className="form-group mb-3">
                  <label htmlFor="title" className="fw-semibold">
                    Grievance Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Enter Complaint Title"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group mb-3">
                  <label htmlFor="description" className="fw-semibold">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Enter Complaint Description"
                    rows="3"
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Address and Pincode */}
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label htmlFor="address" className="fw-semibold">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                      placeholder="Enter Address"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="pincode" className="fw-semibold">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      className="form-control"
                      placeholder="Pincode"
                      maxLength="6"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="form-group mb-3">
                  <label htmlFor="phone" className="fw-semibold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone_number"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    onChange={handleChange}
                    required
                  />
                </div>
              
                {/* Date */}
                <div className="form-group mb-3">
                  <label htmlFor="incidentDate" className="fw-semibold">
                    Date of Incident
                  </label>
                  <input
                    type="date"
                    id="incidentDate"
                    name="incident_date"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* File Upload */}
                <div className="form-group mb-3">
                  <label htmlFor="documents" className="fw-semibold">
                    Upload Supporting Documents
                  </label>
                  <input
                    type="file"
                    id="documents"
                    name="proof_file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                  />
                </div>

                {/* Checkbox */}
                <div className="form-check mb-4">
                  <label className="form-check-label" htmlFor="acknowledgement">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="acknowledgement"
                      required
                    />
                    I confirm that the above information is accurate.
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100 fw-semibold">
                  Submit Complaint
                </button>
              </form>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
    </div>
  );
};

export default SubmitGrievance;