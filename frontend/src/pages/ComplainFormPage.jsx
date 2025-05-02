import React from "react";

const ComplainFormPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Submit a Complaint</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            {/* Add your complaint form here */}
            <form>
              <div className="form-group mb-3">
                <label htmlFor="title">Complaint Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  placeholder="Enter Complaint Title"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  placeholder="Enter Complaint Description"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit Complaint
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplainFormPage;