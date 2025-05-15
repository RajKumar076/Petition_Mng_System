import React from "react";

const ComplainFormPage = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center py-4">
      <div className="container" style={{ height: "710px", overflowY: "auto" }}      >
        <h2 className="text-center mb-5 fw-bold">📝 Submit a Complaint</h2>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow rounded-4 p-4 border-0">
              <form>
                {/* Title */}
                <div className="form-group mb-3">
                  <label htmlFor="title" className="fw-semibold">Complaint Title</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="Enter Complaint Title"
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group mb-3">
                  <label htmlFor="description" className="fw-semibold">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    placeholder="Enter Complaint Description"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Address and Pincode */}
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label htmlFor="address" className="fw-semibold">Address</label>
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      placeholder="Enter Address"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="pincode" className="fw-semibold">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      className="form-control"
                      placeholder="Pincode"
                      maxLength="6"
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="form-group mb-3">
                  <label htmlFor="incidentDate" className="fw-semibold">Date of Incident</label>
                  <input
                    type="date"
                    id="incidentDate"
                    className="form-control"
                    required
                  />
                </div>

                {/* File Upload */}
                <div className="form-group mb-3">
                  <label htmlFor="documents" className="fw-semibold">Upload Supporting Documents</label>
                  <input
                    type="file"
                    id="documents"
                    className="form-control"
                    multiple
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
                  />I confirm that the above information is accurate.
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
      </div>
    </div>
  );
};

export default ComplainFormPage;
// This code creates a responsive complaint form using Bootstrap classes. The form includes fields for the complaint title, description, address, pincode, date of incident, and file upload. It also has a checkbox for confirmation and a submit button. The layout is designed to be user-friendly and visually appealing.