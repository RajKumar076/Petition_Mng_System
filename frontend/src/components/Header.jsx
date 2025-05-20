import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = {
  guest: [
    { to: "/", label: "Home" },
    { to: "#aboutus", label: "About Us", isAnchor: true },
    { to: "#solutions", label: "Solutions", isAnchor: true },
    { to: "/login", label: "Login" },
  ],
  user: [
    { to: "/userdashboard", label: "Dashboard" },
    { to: "/userdashboard/choosedepartment", label: "Complain" },
    { to: "/userdashboard/history", label: "Track Grievance" },
    { to: "/userdashboard/profile", label: "Profile" },
    { to: "/", label: "Logout" },
  ],
  officer: [
    { to: "/officerdashboard", label: "Dashboard" },
    { to: "/officerdashboard/department/:departmentName", label: "Grievances" },
    { to: "/officerdashboard/profile", label: "Profile" },
    { to: "/", label: "Logout" },
  ],
  admin: [
    { to: "/admindashboard", label: "Dashboard" },
    { to: "/admindashboard/view-officers", label: "View Officers" },
    { to: "/admindashboard/view-users", label: "View Users" },
    { to: "/admindashboard/inventory", label: "Grievances" },
    { to: "/", label: "Logout" },
  ],
};

const getRoleFromPath = (pathname) => {
  if (pathname.startsWith("/userdashboard")) return "user";
  if (pathname.startsWith("/officerdashboard")) return "officer";
  if (pathname.startsWith("/admindashboard")) return "admin";
  return "guest";
};

const Header = () => {
  const location = useLocation();

  // Hide header on login page
  if (location.pathname === "/login") return null;

  // Determine role from URL path
  const role = getRoleFromPath(location.pathname);
  const links = navLinks[role] || navLinks.guest;

  return (
    <>
      <style>
        {`
      .custom-nav-link {
        color: #333 !important;
        position: relative;
        transition: color 0.2s;
        font-weight: bold;
        margin: 0 18px;
        padding-bottom: 4px;
        display: inline-block;
      }
      .custom-nav-link:hover, .custom-nav-link.active {
        text-decoration: none;
        color: #fff !important;
      }
      `}
      </style>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#9352dd" }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Grievance System
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
  {links.map((link) => (
    <li className="nav-item" key={link.label}>
      {role === "guest" && link.isAnchor ? (
        <a
          className={`custom-nav-link nav-link`}
          href={link.to}
          onClick={e => {
            e.preventDefault();
            const anchorId = link.to.replace("#", "");
            const el = document.getElementById(anchorId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {link.label}
        </a>
      ) : (
        <Link
          className={`custom-nav-link nav-link${location.pathname === link.to ? " active" : ""}`}
          to={link.to}
        >
          {link.label}
        </Link>
      )}
    </li>
  ))}
</ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;