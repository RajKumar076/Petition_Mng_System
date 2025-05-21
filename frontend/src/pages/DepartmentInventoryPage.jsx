import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DepartmentTable from "../components/DepartmentTable";
import { useParams } from "react-router-dom";

const DepartmentInventoryPage = () => {
  const { departmentName } = useParams(); // for admin dashboard route
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (departmentName) {
    setDepartment(departmentName);
    setLoading(false);
  } else {
    const fetchProfile = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setDepartment("");
          setLoading(false);
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:8000/api/profile/?username=${username}`
        );
        if (response.ok) {
          const data = await response.json();
          // Check if department is an object or string
          if (typeof data.department === "object" && data.department !== null) {
            setDepartment(data.department.name || "");
          } else {
            setDepartment(data.department || "");
          }
        } else {
          setDepartment("");
        }
      } catch (err) {
        setDepartment("");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }
}, [departmentName]);

  if (loading) {
    return (
      <div>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div
        className="container-fluid bg-white mt-4"
        style={{
          overflowX: "hidden",
          paddingRight: 0,
          paddingLeft: 0,
        }}
      >
        <h2
          className="mb-4 text-center text-capitalize"
          style={{
            color: "#9352dd",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          {department} Department
        </h2>
        <DepartmentTable department={department} limit={100} />
      </div>
    </div>
  );
};

export default DepartmentInventoryPage;