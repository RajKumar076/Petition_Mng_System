import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Header from "../components/Header.jsx";

const DepartmentCards = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/departments/')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

<<<<<<< HEAD
  const handleCardClick = (department) => {
    navigate(`/complaint-form/${department.name}`, { state: { department } });
    // navigate(`/complaint-form`);
=======
  const handleCardClick = (departmentName) => {
    navigate(`./complaintform/${departmentName}`);
>>>>>>> 104ecf769ae06be007f2a3258c3a80dc5061569c
  };

  return (
    <div>
    <Header />
    <div className="bg-light d-flex flex-column justify-content-center align-items-center py-4" style={{ background: 'linear-gradient(to bottom right, #f8f9fa, #e9ecef)' }}>
        <h1 className="text-center mb-5 fw-bold">Choose a Department</h1>
        <div className="container-fluid">
        <div className="row g-4">
          {departments.map((dept, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4">
              <div
                className="card h-100 shadow-sm border-0"
                onClick={() => handleCardClick(dept.name)} // Pass only the department name
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={dept.image_url}
                  className="card-img-top"
                  alt={dept.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{dept.name}</h5>
                  <p className="card-text text-muted">{dept.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
    </div>
    </div>
  );
};

export default DepartmentCards;