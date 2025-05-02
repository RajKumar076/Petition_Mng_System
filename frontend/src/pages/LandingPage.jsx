import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Import the existing Header component

const LandingPage = () => {
  const navigate = useNavigate();

  const handleFileComplaint = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1" 
        style={{
            backgroundImage: "url('/images/background.webp')", // Replace with your image path
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat", // Prevent image repetition
            backgroundAttachment: "fixed", // Fix the image while scrollinga
      }}>
        <div
          className="text-center p-5 shadow rounded"
          style={{
            maxWidth: "800px",
            backgroundColor: "rgba(255, 255, 255, 0)", // Transparent background
            //boxShadow: "5px 5px 10px 5px rgba(0, 0, 0, 0.5)", // Shadow effect 
            // boxShadow: "0 0 30px rgba(0, 0, 0, .2)", // Shadow effect
            borderRadius: "10px",
            backdropFilter: "blur(5px)", // Blur effect for the background
          }}

        >
          <h1 className="text-primary mb-4 display-5 fw-bold">Welcome to the Grievance Redressal System</h1>
          <p className="text-white mb-4">
            Our government is committed to addressing the concerns of its citizens. This platform
            allows you to file complaints and track their status across various departments. Your
            voice matters, and we are here to listen and act.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleFileComplaint}>
            File a Complaint
          </button>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="bg-dark text-white py-2">
        <div className="container text-center">
          <p className="mb-0" style={{ fontSize: "0.9rem" }}>
            &copy; 2025 Grievance Redressal System. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default LandingPage;