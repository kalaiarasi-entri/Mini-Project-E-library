import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // new state

  const handleLogin = () => {
    setLoading(true); // disable the button
    const usersByRole = JSON.parse(localStorage.getItem("usersByRole")) || {};
    let matchedUser = null;
    let userRole = "";

    for (const role in usersByRole) {
      const found = usersByRole[role].find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        matchedUser = found;
        userRole = role;
        break;
      }
    }

    if (matchedUser) {
      dispatch(login(matchedUser));
      toast.success(`Logged in as ${userRole}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // transition: Bounce,
      });

      setTimeout(() => {
        switch (userRole) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "librarian":
            navigate("/librarian-dashboard");
            break;
          case "student":
            navigate("/student-dashboard");
            break;
          case "faculty":
            navigate("/faculty-dashboard");
            break;
          case "guest":
            navigate("/guest-dashboard");
            break;
          default:
            navigate("/");
        }
      }, 800);
    } else {
      toast.error("Invalid credentials or user not found", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // transition: Bounce,
      });
      setLoading(false); // re-enable the button on error
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center text-white"
      style={{
        backgroundImage:
          "url(https://thumbs.dreamstime.com/z/digital-library-online-education-concept-laptop-computer-colorful-books-d-rendering-digital-library-online-education-125338333.jpg?ct=jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(5px)",
          zIndex: 0,
        }}
      />

      <div className="container position-relative z-1 animate__animated animate__fadeIn">
        <div className="row justify-content-center text-center mb-5">
          <h1 className="display-7 fw-bold">E-Library Management System</h1>
          <p className="lead text-light">
            Access. Organize. Learn - Anytime, Anywhere.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card bg-dark text-white p-4 shadow animate__animated animate__zoomIn">
              <h2 className="text-center mb-4">Sign In</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  className="form-control mb-3"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="form-control mb-3"
                  type="password"
                  placeholder="Password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                  title="Password must contain at least 6 characters, one uppercase, one lowercase, and one digit"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary w-100"   onClick={handleLogin}  disabled={loading}>
                   {loading ? "Logging in..." : " Sign In"}
                </button>
              </form>
              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <a href="/register" className="text-info">
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
