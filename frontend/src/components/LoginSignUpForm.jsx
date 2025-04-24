import { useState, useEffect } from "react";
import "./SignUpLogInForm.css";

const LoginSignUpForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const [sampleData, setSampleData] = useState([]);

  // Load sample data from the JSON file or localStorage
  useEffect(() => {
    const loadData = async () => {
      const storedData = localStorage.getItem("sampleData");
      if (storedData) {
        setSampleData(JSON.parse(storedData));
      } else {
        const response = await fetch("public/data/sampleData.json");
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

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate database check using sample data
    const user = sampleData.find(
      (u) =>
        u.username === formData.username &&
        u.password === formData.password &&
        u.role === formData.role
    );

    if (user) {
      alert("Login successful: " + user.role);
      onLogin(user.role); // Send the user role to App.jsx
    } else {
      alert("Invalid credentials or role mismatch");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add the new user to the sampleData array
    const newUser = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
    };

    // Check if the username already exists
    const userExists = sampleData.some((u) => u.username === newUser.username);
    if (userExists) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    const updatedData = [...sampleData, newUser];
    setSampleData(updatedData); // Update the state
    localStorage.setItem("sampleData", JSON.stringify(updatedData)); // Save to localStorage
    alert("Registration successful");
    setIsLogin(true); // Switch to login view
  };

  return (
    <div className="main-container">
      <div className={`container ${isLogin ? "" : "active"}`}>
        {isLogin ? (
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
              <div className="input-box">
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user" name="user">User</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="forgot-link">
                <a href="#">Forgot Password?</a>
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
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
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