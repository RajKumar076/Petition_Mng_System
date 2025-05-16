import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";

const ViewOfficers = () => {
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    // Fetch data from sampleData.json and filter officers
    const fetchOfficers = async () => {
      try {
        const response = await fetch("/data/sampleData.json");
        const data = await response.json();
        const filteredOfficers = data.filter((item) => item.role === "officer"); // Filter officers
        setOfficers(filteredOfficers);
      } catch (error) {
        console.error("Error fetching officers:", error);
      }
    };

    fetchOfficers();
  }, []);

  return (
    <div>
      <Header />
    <div className="container mt-4">
      <h2 className="mb-4">All Officers</h2>
      <div className="row">
        {officers.map((officer, index) => (
          <div key={index} className="col-lg-2 col-md-3 col-sm-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">{officer.username}</h5>
                <p className="card-text">{officer.department}</p>
                <p className="card-text">{officer.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ViewOfficers;