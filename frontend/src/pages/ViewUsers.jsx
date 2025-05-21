import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data with petition stats from backend API
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/");
        const data = await response.json();
        // Filter out superusers, officers, and admins (assuming role field exists)
        const filtered = Array.isArray(data)
          ? data.filter(
              (user) =>
                !user.is_superuser &&
                (!user.role || user.role === "user")
            )
          : [];
        setUsers(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // fallback to empty array on error
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <div className="container-fluid mt-4">
        <h2
          className="mb-4"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#444",
            letterSpacing: "1px",
          }}
        >
          All Users
        </h2>
        <div className="table-responsive">
          <table
            className="table table-bordered table-hover"
            style={{
              borderRadius: "18px",
              fontSize: "1.2rem",
              tableLayout: "fixed",
              marginBottom: 0,
              background: "#fff",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderTopLeftRadius: "18px",
                    backgroundColor: "#9352dd",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.35rem",
                    height: "60px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundClip: "padding-box",
                  }}
                >
                  SI No.
                </th>
                <th
                  style={{
                    backgroundColor: "#9352dd",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.35rem",
                    height: "60px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundClip: "padding-box",
                  }}
                >
                  User Name
                </th>
                <th
                  style={{
                    backgroundColor: "#9352dd",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.35rem",
                    height: "60px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundClip: "padding-box",
                  }}
                >
                  User Email
                </th>
                <th
                  style={{
                    backgroundColor: "#9352dd",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.35rem",
                    height: "60px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundClip: "padding-box",
                  }}
                >
                  No. of Grievance Applied
                </th>
                <th
                  style={{
                    borderTopRightRadius: "18px",
                    backgroundColor: "#9352dd",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.35rem",
                    height: "60px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundClip: "padding-box",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id || idx} style={{ textAlign: "center", height: "56px" }}>
                  <td>{idx + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.petition_count ?? 0}</td>
                  <td>
                    {user.petition_count
                      ? `${user.petitions_solved ?? 0}/${user.petition_count} Solved`
                      : "0/0 Solved"}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;