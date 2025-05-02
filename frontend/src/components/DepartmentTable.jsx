import React, { useState, useEffect } from "react";

const DepartmentTable = ({ department, limit = 5 }) => {
  const [data, setData] = useState([]);

  // Load data dynamically based on the department
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/data/${department.toLowerCase()}.json`);
        const departmentData = await response.json();
        setData(departmentData.slice(0, limit)); // Limit the data
      } catch (err) {
        console.error("Error loading department data:", err);
      }
    };
    loadData();
  }, [department, limit]);

  // Function to get color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "solved":
        return "text-success p-3"; // Bootstrap success class
      case "pending":
        return "text-warning p-3"; // Bootstrap warning class
      case "rejected":
        return "text-danger p-3"; // Bootstrap danger class
      case "unsolved":
        return "text-secondary p-3"; // Bootstrap secondary class
      default:
        return "text-info p-3"; // Bootstrap info class
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      {/* <div className="container"> */}
        {/* <h3 className="text-center text-primary mb-4">
          {department.toUpperCase()} DEPARTMENT COMPLAINTS
        </h3> */}
        <div className="table-responsive w-100 rounded" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ id, title, status }) => (
                <tr key={id}>
                  <td className="p-3">{id}</td>
                  <td className="p-3">{title}</td>
                  <td className={getStatusColor(status)}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {/* </div> */}
    </div>
  );
};

export default DepartmentTable;