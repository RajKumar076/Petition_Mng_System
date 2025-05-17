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
    if (role === "admin") navigate("/admindashboard");
    else if (role === "officer") navigate("/officerdashboard");
    else if (role === "user") navigate("/userdashboard");
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/login" element={<LoginSignUpForm onLogin={handleLogin} />} /> {/* Login Page */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role={userRole} allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officerdashboard"
          element={
            <ProtectedRoute role={userRole} allowedRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute role={userRole} allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path=":roledashboard/department/:departmentName" element={<DepartmentInventoryPage />} />
        <Route path="userdashboard/history" element={<StatusPage />} />
        <Route path="userdashboard/choosedepartment" element={<ChooseDepartment />} />
        {/* <Route path="/complain-form/:departmentName" element={<ComplainFormPage />} /> */}
        <Route path="userdashboard/choosedepartment/complaintform/:departmentName" element={<ComplainFormPage />} />
        <Route path="admindashboard/inventory" element={<Inventory />} /> {/* New Inventory Route */}
        <Route path="admindashboard/view-users" element={<ViewUsers />} />
        <Route path="admindashboard/view-officers" element={<ViewOfficers />} />
        <Route path="admindashboard/add-officer" element={<AddOfficer />} />
        <Route path="admindashboard/add-category" element={<AddCategory />} />
      </Routes>
    </div>
  );
}

export default App;