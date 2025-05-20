import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/profile/", {
          credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMsg(errorData.detail || "Could not load profile.");
          setProfile(null);
        } else {
          const data = await response.json();
          setProfile(data);
          setErrorMsg("");
        }
      } catch (error) {
        setProfile(null);
        setErrorMsg("Network error or server not reachable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div>{errorMsg || "Could not load profile."}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div
        className="container"
        style={{
          maxWidth: "500px",
          margin: "40px auto",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "32px 24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#9352dd",
            marginBottom: "32px",
            letterSpacing: "1px",
          }}
        >
          Your Profile
        </h2>
        <div style={{ fontSize: "1.2rem", lineHeight: "2.2" }}>
          <div>
            <strong>Name:</strong> {profile.username}
          </div>
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
          {profile.role === "officer" && profile.department && (
            <div>
              <strong>Department:</strong> {profile.department}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;