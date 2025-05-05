import React, { useEffect, useState } from "react";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from sampleData.json and filter users
    const fetchUsers = async () => {
      try {
        const response = await fetch("/data/sampleData.json");
        const data = await response.json();
        const filteredUsers = data.filter((item) => item.role === "user"); // Filter users
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Users</h2>
      <div className="row">
        {users.map((user, index) => (
          <div key={index} className="col-lg-2 col-md-3 col-sm-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">{user.username}</h5>
                <p className="card-text">{user.email}</p>
                <p className="card-text">{user.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewUsers;