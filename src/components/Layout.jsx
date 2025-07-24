import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import {
  User,
  BookOpen,
  Users,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Bell,
  Library,
  UserCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import "./Sidebar.css";

export default function Layout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role || "guest";

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    navigate("/");
    toast.info(`Logged out succesfully`, {
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
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("admin-dashboard")) return "Admin Dashboard";
    if (path.includes("admin-reports")) return "Student Reports";
    if (path.includes("users")) return "Manage Users";
    if (path.includes("librarian-dashboard")) return "Librarian Dashboard";
    if (path.includes("borrowed-books")) return "Borrowed Books";
    if (path.includes("books") && !path.includes("my-books"))
      return "Manage Books";
    if (path.includes("borrow-requests")) return "Borrow Requests";
    if (path.includes("student-dashboard")) return "Student Dashboard";
    if (path.includes("my-books")) return "My Books";
    if (path.includes("profile")) return "My Profile";
    if (path.includes("guest-dashboard")) return "Guest Dashboard";
    if (path.includes("students-details")) return "Student Details";
    if (path.includes("student-reports")) return "Student Reports";

    return "Dashboard";
  };

  const getPageIcon = () => {
    const title = getPageTitle();
    switch (title) {
      case "Admin Dashboard":
      case "Student Dashboard":
      case "Librarian Dashboard":
        return (
          <LayoutDashboard
            size={26}
            className="text-info animate__animated animate__fadeInLeft"
          />
        );
      case "Manage Books":
      case "My Books":
        return (
          <BookOpen
            size={26}
            className="text-primary animate__animated animate__fadeInLeft"
          />
        );
      case "Borrow Requests":
      case "Borrowed Books":
        return (
          <Library
            size={26}
            className="text-warning animate__animated animate__fadeInLeft"
          />
        );
      case "My Profile":
        return (
          <User
            size={26}
            className="text-primary animate__animated animate__fadeInLeft"
          />
        );
      case "Student Details":
        return (
          <User
            size={26}
            className="text-white animate__animated animate__fadeInLeft"
          />
        );
      case "Student Reports":
        return (
          <FileText
            size={26}
            className="text-white animate__animated animate__fadeInLeft"
          />
        );
      default:
        return (
          <LayoutDashboard
            size={26}
            className="text-secondary animate__animated animate__fadeInLeft"
          />
        );
    }
  };

  const menuItems = [
    role === "admin" && {
      path: "/admin-dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    role === "admin" && {
      path: "/users",
      icon: <Users size={18} />,
      label: "Manage Users",
    },
    role === "admin" && {
      path: "/books",
      icon: <BookOpen size={18} />,
      label: "Manage Books",
    },
    role === "admin" && {
      path: "/student-reports",
      icon: <FileText size={18} />,
      label: "Reports",
    },
    role === "librarian" && {
      path: "/librarian-dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    role === "librarian" && {
      path: "/books",
      icon: <BookOpen size={18} />,
      label: "Manage Books",
    },
    role === "librarian" && {
      path: "/borrow-requests",
      icon: <Library size={18} />,
      label: "Borrow Requests",
    },
    role === "faculty" && {
      path: "/faculty-dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    role === "faculty" && {
      path: "/students-details",
      icon: <Users size={18} />,
      label: "Students",
    },
    ["faculty"].includes(role) && {
      path: "/books",
      icon: <BookOpen size={18} />,
      label: "Books",
    },
    role === "faculty" && {
      path: "/student-reports",
      icon: <FileText size={18} />,
      label: "Reports",
    },
    role === "student" && {
      path: "/student-dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    role === "student" && {
      path: "/my-books",
      icon: <BookOpen size={18} />,
      label: "My Books",
    },
    role === "student" && {
      path: "/borrowed-books",
      icon: <Library size={18} />,
      label: "Borrowed Books",
    },
    // role === "student" && {
    //   path: "/profile",
    //   icon: <User size={18} />,
    //   label: "My Profile",
    // },
    role === "guest" && {
      path: "/guest-dashboard",
      icon: <Search size={18} />,
      label: "Browse Books",
    },
  ].filter(Boolean);

  return (
    <div
      className="d-flex"
      style={{ height: "100vh", backgroundColor: "#121212", color: "white" }}
    >
      {/* Sidebar */}
      <aside
        className="bg-dark p-3 d-flex flex-column shadow animate__animated animate__fadeInLeft"
        style={{ width: "250px" }}
      >
        <div className="d-flex align-items-center gap-2 mb-4">
          <svg
            width="240"
            height="70"
            viewBox="0 0 500 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00c6ff" />
                <stop offset="100%" stopColor="#0072ff" />
              </linearGradient>
            </defs>

            {/* Gradient rounded square with white "e" */}
            <rect
              x="10"
              y="20"
              width="70"
              height="70"
              rx="16"
              fill="url(#blueGrad)"
            />
            <text
              x="45"
              y="78"
              textAnchor="middle"
              fontSize="68"
              fontFamily="Poppins, sans-serif"
              fill="white"
              fontWeight="600"
            >
              e
            </text>

            {/* eLibrary text */}
            <text
              x="100"
              y="70"
              fontFamily="Poppins, sans-serif"
              fontSize="62"
              fontWeight="600"
              fill="url(#blueGrad)"
            >
              eLibrary
            </text>
          </svg>
        </div>

        <ul className="nav flex-column mb-auto">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={idx}
                className="mb-2 animate__animated animate__fadeInUp"
              >
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded sidebar-link ${
                    isActive ? "active" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className="btn btn-danger mt-auto w-100"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={18} className="me-2" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-auto">
        {/* Top Navbar */}
        <div className="position-relative shadow-sm py-3 px-4 animate__animated animate__fadeInDown">
          {/* Centered Page Title */}
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <h2 className="text-white mb-0 d-flex align-items-center gap-2 justify-content-center">
              {getPageIcon()}
              <span className="fw-bold fs-3">{getPageTitle()}</span>
            </h2>
          </div>

          {/* Right Profile & Notifications */}
          <div className="d-flex justify-content-end align-items-center gap-4">
            <div className="position-relative animate__animated animate__heartBeat animate__slower">
              <Bell size={22} className="text-light" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                alt="Profile"
                width="36"
                height="36"
                className="rounded-circle border border-light shadow-sm"
              />
              <span className="fw-semibold text-white text-capitalize">
                {user?.username || "Guest"}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="modal d-block fade show animate__animated animate__zoomIn"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
              </div>
              <div className="modal-body">Are you sure you want to logout?</div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleLogoutConfirm}
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
