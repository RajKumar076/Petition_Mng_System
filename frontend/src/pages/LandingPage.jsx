import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Import the existing Header component

const LandingPage = () => {
  const navigate = useNavigate();

  const handleFileComplaint = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div
        className="d-flex flex-grow-1 align-items-center justify-content-center"
        style={{
          backgroundColor: "#f7f7f7",
          padding: "40px 0", // Add top and bottom space
        }}
      >
        {/* Left Side: Image */}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            flex: 1,
            height: "100%",
            paddingLeft: "20px", // Add space to the left of the image
          }}
        >
          <img
            src="/images/background.jpg" // Ensure this path is correct
            alt="Background"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "cover",
              borderRadius: "15px", // Make the image corners rounded
            }}
          />
        </div>

        {/* Right Side: Text */}
        <div
          className="d-flex flex-column justify-content-center align-items-start p-5"
          style={{
            flex: 1,
            height: "100%",
          }}
        >
          <h1 className="mb-4 display-6 fw-bold" style={{ color: "#9352dd" }}>
            Welcome to the Grievance Redressal System
          </h1>
          <p className="text-dark mb-4" style={{ fontSize: "14px" }}>
            Our government is committed to addressing the concerns of its citizens. This platform
            allows you to file complaints and track their status across various departments. Your
            voice matters, and we are here to listen and act.
          </p>
          <div className="d-flex justify-content-center w-100">
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "10px 20px" }} // Center the button
              onClick={handleFileComplaint}
            >
              File a Complaint
            </button>
          </div>
        </div>
      </div>

      {/* How the System Works Section */}
<div
  style={{
    backgroundColor: "#9352dd",
    color: "white",
    padding: "10px 20px", // Reduce strap size and add padding
    margin: "20px auto", // Prevent touching the sides
    maxWidth: "90%",
    borderRadius: "10px", // Add rounded corners to the strap
  }}
>
  <h2 className="text-center fw-bold mb-0" style={{ fontSize: "18px" }} id="aboutus">
    How our System Works
  </h2>
</div>
<div className="d-flex flex-wrap align-items-center justify-content-between my-5" style={{ padding: "0 20px" }}>
  {/* Left Side: 2x2 Grid */}
  <div className="d-flex flex-wrap" style={{ flex: 1 }}>
    <div className="p-3" style={{ width: "50%" }}>
      <h5 className="fw-bold" style={{ fontSize: "16px" }}>
        1. Grievance Filing
      </h5>
      <p style={{ fontSize: "14px" }}>
        Citizens can file their grievances through the platform by providing detailed information
        about their issues.
      </p>
    </div>
    <div className="p-3" style={{ width: "50%" }}>
      <h5 className="fw-bold" style={{ fontSize: "16px" }}>
        2. AI-Powered Categorization
      </h5>
      <p style={{ fontSize: "14px" }}>
        Our AI system categorizes the grievances and assigns them to the appropriate department for
        resolution.
      </p>
    </div>
    <div className="p-3" style={{ width: "50%" }}>
      <h5 className="fw-bold" style={{ fontSize: "16px" }}>
        3. Departmental Processing
      </h5>
      <p style={{ fontSize: "14px" }}>
        The assigned department reviews the grievance and takes the necessary steps to address the
        issue.
      </p>
    </div>
    <div className="p-3" style={{ width: "50%" }}>
      <h5 className="fw-bold" style={{ fontSize: "16px" }}>
        4. Resolution and Feedback
      </h5>
      <p style={{ fontSize: "14px" }}>
        Once resolved, the citizen is notified, and feedback is collected to improve the system
        further.
      </p>
    </div>
  </div>

  {/* Right Side: Image */}
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      flex: 1,
      paddingLeft: "20px", // Add space to the left of the image
    }}
  >
    <img
      src="/images/work.jpg" // Ensure this path is correct
      alt="How the System Works"
      style={{
        maxWidth: "100%",
        borderRadius: "15px", // Rounded corners for the image
      }}
    />
  </div>
</div>
{/* Features of Our Solutions Section */}
<div
  style={{
    backgroundColor: "#9352dd",
    color: "white",
    padding: "10px 20px", // Strap size and padding
    margin: "20px auto", // Center the strap and reduce width
    maxWidth: "90%", // Reduce strap width
    borderRadius: "10px", // Rounded corners
  }}
>
  <h2 className="text-center fw-bold mb-0" style={{ fontSize: "18px" }} id="solutions">
    Features of Our Solutions
  </h2>
</div>
<div className="d-flex flex-wrap align-items-center justify-content-between my-5" style={{ padding: "0 20px" }}>
  {/* Left Side: Image */}
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      flex: 1,
      paddingRight: "20px", // Add space to the right of the image
    }}
  >
    <img
      src="/images/solution.jpg" // Ensure this path is correct
      alt="Features of Our Solutions"
      style={{
        maxWidth: "100%", // Adjust the image size
        borderRadius: "15px", // Rounded corners for the image
      }}
    />
  </div>

  {/* Right Side: Content */}
  <div
    className="d-flex flex-column justify-content-center"
    style={{
      flex: 1,
      paddingLeft: "20px", // Add space to the left of the content
    }}
  >
    <div className="p-3">
      <h5 className="fw-bold" style={{ fontSize: "16px" }}>
        Efficient Complaint Filing
      </h5>
      <p style={{ fontSize: "14px" }}>
        Our platform ensures a seamless and user-friendly experience for filing complaints. Citizens
        can provide detailed information about their grievances, upload supporting documents, and
        track their complaint status in real-time.
      </p>
    </div>
    <div className="p-3">
      <h5 className="fw-bold" style={{ fontSize: "16px" }}>
        Better Solutions with AI
      </h5>
      <p style={{ fontSize: "14px" }}>
        Leveraging AI technology, we categorize complaints accurately and assign them to the
        appropriate departments. This ensures faster resolution and better outcomes for citizens.
      </p>
    </div>
  </div>
</div>
    </div>
  );
};

export default LandingPage;