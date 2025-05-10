import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import UserDashboard from "./pages/UserDashboard";
import DepartmentInventoryPage from "./pages/DepartmentInventoryPage";
import StatusPage from "./pages/StatusPage";
import ChooseDepartment from "./pages/ChooseDepartment";
import ComplainFormPage from "./pages/ComplainFormPage";
import LandingPage from "./pages/LandingPage"; // Import the LandingPage
import Inventory from "./pages/Inventory"; // Import the Inventory page
import ViewUsers from "./pages/ViewUsers";
import ViewOfficers from "./pages/ViewOfficers";
import AddOfficer from "./pages/AddOfficer";
import AddCategory from "./pages/AddCategory";
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
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/login" element={<LoginSignUpForm onLogin={handleLogin} />} /> {/* Login Page */}
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
        <Route path="/view-status" element={<StatusPage />} />
        <Route path="/choose-department" element={<ChooseDepartment />} />
        {/* <Route path="/complain-form/:departmentName" element={<ComplainFormPage />} /> */}
        <Route path="/complain-form" element={<ComplainFormPage />} />
        <Route path="/inventory" element={<Inventory />} /> {/* New Inventory Route */}
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/view-officers" element={<ViewOfficers />} />
        <Route path="/add-officer" element={<AddOfficer />} />
        <Route path="/add-category" element={<AddCategory />} />
      </Routes>
    </div>
  );
}

export default App;