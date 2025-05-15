import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// const departments = [
//   {
//     name: "Municipal Administration / Local Body",
//     details: "Garbage collection, streetlights, drainage, water supply, etc.",
//     image: "https://www.myhmc.in/wp-content/uploads/2020/02/consevency1.jpg",
//     slug: "municipal"
//   },
//   {
//     name: "Public Works Department (PWD)",
//     details: "Road maintenance, public building repairs, bridges, etc.",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrsc7Ou57AuDFkefAauEk9xJd6e_8SjtCQZQ&s",
//     slug: "pwd"
//   },
//   {
//     name: "Electricity Board / Energy Department",
//     details: "Power outages, billing issues, transformer faults, etc.",
//     image: "https://media.istockphoto.com/id/522626006/photo/electrical-engineer-while-working-laptopl.jpg?s=612x612&w=0&k=20&c=tO6oiU2L73xoD9XUB_mmmV-z0QKYUagS5T8Ml9kuRzY=",
//     slug: "electricity"
//   }
// ];

const DepartmentCards = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/departments/')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  const handleCardClick = (department) => {
    navigate(`/complaint-form/${department.name}`, { state: { department } });
  };

  return (
    <div className="min-vh-100 py-5" style={{ background: 'linear-gradient(to bottom right, #f8f9fa, #e9ecef)' }}>
      <div className="container">
        <h1 className="text-center mb-5 fw-bold">Choose a Department</h1>
        <div className="row g-4">
          {departments.map((dept, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4">
              <div
                className="card h-100 shadow-sm border-0"
                onClick={() => handleCardClick(dept)}
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
  );
};

export default DepartmentCards;
