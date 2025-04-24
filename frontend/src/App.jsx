import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import UserDashboard from "./pages/UserDashboard";
import DepartmentInventoryPage from "./pages/DepartmentInventoryPage";
import "./App.css";
import LoginSignUpForm from "./components/LoginSignUpForm";

function ProtectedRoute({ role, allowedRole, children }) {
  if (role !== allowedRole) {
    return <div>Access Denied</div>; // Show an access denied message or redirect to login
  }
  return children;
}

function App() {
  const [userRole, setUserRole] = useState(null); // State to store the user role
  const navigate = useNavigate();

  // Simulate login and role assignment
  const handleLogin = (role) => {
    setUserRole(role); // Set the user role based on login
    if (role === "admin") navigate("/admin");
    else if (role === "officer") navigate("/officer");
    else if (role === "user") navigate("/user");
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginSignUpForm onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={userRole} allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer"
          element={
            <ProtectedRoute role={userRole} allowedRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute role={userRole} allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/department/:departmentName" element={<DepartmentInventoryPage />} />
      </Routes>
    </div>
  );
}

export default App;