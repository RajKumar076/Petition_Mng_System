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

  return (
    <div className="my-4 border rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">{department.toUpperCase()} DEPARTMENT COMPLAINTS</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Title</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, title, status }) => (
            <tr key={id} className="border-t">
              <td className="p-2">{id}</td>
              <td className="p-2">{title}</td>
              <td className="p-2">{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentTable;