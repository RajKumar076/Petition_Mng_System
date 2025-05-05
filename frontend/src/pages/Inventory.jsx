import React, { useEffect, useState } from "react";

const Inventory = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    // Fetch grievances from JSON files for all departments
    const fetchGrievances = async () => {
      try {
        const departments = ["Health", "Education", "Transport", "Sanitation"];
        const allGrievances = [];

        for (const dept of departments) {
          const response = await fetch(`/data/${dept.toLowerCase()}.json`);
          const data = await response.json();
          const grievancesWithDept = data.map((grievance) => ({
            ...grievance,
            department: dept, // Add department name to each grievance
          }));
          allGrievances.push(...grievancesWithDept);
        }

        setGrievances(allGrievances);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      }
    };

    fetchGrievances();
  }, []);

  return (
    <div
      className="container mt-4"
      style={{
        width: "95%", // Occupy 95% of the viewport width
        height: "95vh", // Occupy 95% of the viewport height
        margin: "auto", // Center the container horizontally
        padding: "10px", // Add some padding
        overflow: "hidden", // Prevent overflow
      }}
    >
      <h2 className="mb-4">All Grievances</h2>
      {/* Scrollable Table Container */}
      <div
        style={{
          maxHeight: "90%", // Occupy 90% of the container height
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <table className="table table-bordered table-striped">
          <thead
            className="thead-dark"
            style={{
              position: "sticky", // Make the header row fixed
              top: "0", // Stick to the top of the container
              zIndex: "1", // Ensure it stays above the table body
            }}
          >
            <tr className="rounded">
              <th className="bg-secondary text-white">ID</th>
              <th className="bg-secondary text-white">Title</th>
              <th className="bg-secondary text-white">Description</th>
              <th className="bg-secondary text-white">Status</th>
              <th className="bg-secondary text-white">Department</th> {/* New Department Column */}
            </tr>
          </thead>
          <tbody>
            {grievances.map((grievance, index) => (
              <tr key={index}>
                <td>{grievance.id}</td>
                <td>{grievance.title}</td>
                <td>{grievance.description}</td>
                <td>{grievance.status}</td>
                <td>{grievance.department}</td> {/* Display Department */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;