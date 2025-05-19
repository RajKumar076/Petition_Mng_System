import { useState, useEffect } from "react";
import "./SignUpLogInForm.css";

const LoginSignUpForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle for Forgot Password
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
    newPassword: "", // For Forgot Password
  });
  const [sampleData, setSampleData] = useState([]);

  // Load sample data from the JSON file or localStorage
  useEffect(() => {
    const loadData = async () => {
      const storedData = localStorage.getItem("sampleData");
      if (storedData) {
        setSampleData(JSON.parse(storedData));
      } else {
        const response = await fetch("/data/sampleData.json");
        const data = await response.json();
        setSampleData(data);
        localStorage.setItem("sampleData", JSON.stringify(data)); // Save to localStorage
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // // Simulate database check using sample data
    // const user = sampleData.find(
    //   (u) =>
    //     u.username === formData.username &&
    //     u.password === formData.password &&
    //     u.role === formData.role
    // );

    // if (user) {
    //   alert("Login successful: " + user.role);
    //   onLogin(user.role); // Send the user role to App.jsx
    // } else {
    //   alert("Invalid credentials or role mismatch");
    // }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // Save the access token (and refresh token if returned)
        localStorage.setItem("access_token", data.access); // <-- important
        localStorage.setItem("refresh_token", data.refresh); 
        
        console.log("Role from backend:", data.role); // Debug log
        alert(data.message);
        onLogin(data.role); // Pass user role to parent component
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    
  };

  const handleRegister = async(e) => {
    e.preventDefault();
    // // Add the new user to the sampleData array
    // const newUser = {
    //   username: formData.username,
    //   email: formData.email,
    //   password: formData.password,
    //   role: formData.role,
    // };

    // // Check if the username already exists
    // const userExists = sampleData.some((u) => u.username === newUser.username);
    // if (userExists) {
    //   alert("Username already exists. Please choose a different username.");
    //   return;
    // }

    // const updatedData = [...sampleData, newUser];
    // setSampleData(updatedData); // Update the state
    // localStorage.setItem("sampleData", JSON.stringify(updatedData)); // Save to localStorage
    // alert("Registration successful");
    // setIsLogin(true); // Switch to login view
    // setTimeout(() => {
    //   window.location.reload(); // Reload the page to reflect changes
    // }, 1200);


    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setIsLogin(true); // Switch to login view
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }

  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    // Find the user in the sample data
    const userIndex = sampleData.findIndex(
      (u) =>
        u.username.toLowerCase().trim() === formData.username.toLowerCase().trim() &&
        u.email.toLowerCase().trim() === formData.email.toLowerCase().trim() &&
        u.role.toLowerCase().trim() === formData.role.toLowerCase().trim()
    );

    if (userIndex !== -1) {
      // Update the user's password
      const updatedData = [...sampleData];
      updatedData[userIndex].password = formData.newPassword;

      // Save the updated data to localStorage
      setSampleData(updatedData);
      localStorage.setItem("sampleData", JSON.stringify(updatedData));

      alert("Password reset successfully!");
      setIsForgotPassword(false); // Switch back to login view
    } else {
      alert("Invalid username, email, or role.");
    }
  };

  return (
    <div className="main-container">
      <div
        className={`container ${
          isForgotPassword ? "forgot-active" : isLogin ? "" : "active"
        }`}
      >
        {isForgotPassword ? (
          <div className="form-box forgot-password">
            <form onSubmit={handleResetPassword}>
              <h1>Forgot Password</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-envelope"></i>
              </div>
              {/* <div className="input-box">
                <select
                  name="role"
                  className="form-select"
                  required
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select> 
              </div>*/}
              <div className="input-box">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <button type="submit" className="btn">
                Reset Password
              </button><br /><br />
              <button
                type="button"
                className="btn-link"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </button>
            </form>
          </div>
        ) : isLogin ? (
          <div className="form-box login">
            <form onSubmit={handleLogin}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              {/* <div className="input-box">
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div> */}
              <div className="forgot-link">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="btn">
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="form-box register">
            <form onSubmit={handleRegister}>
              <h1>Registration</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <div className="input-box">
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  {/* <option value="officer">Officer</option> */}
                  {/* <option value="admin">Admin</option> */}
                </select>
              </div>
              <button type="submit" className="btn">
                Register
              </button>
            </form>
          </div>
        )}

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn" onClick={() => setIsLogin(false)}>
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={() => setIsLogin(true)}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpForm;