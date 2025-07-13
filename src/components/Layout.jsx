import React from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

import {
  User,
  BookOpen,
  Users,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  UserCircle2,
} from "lucide-react";

export default function Layout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.role || "guest";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const renderMenuItems = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <li>
              <Link to="/admin-dashboard" className="nav-link text-white">
                <LayoutDashboard size={18} className="me-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/users" className="nav-link text-white">
                <Users size={18} className="me-2" />
                Manage Users
              </Link>
            </li>
            <li>
              <Link to="/books" className="nav-link text-white">
                <BookOpen size={18} className="me-2" />
                Manage Books
              </Link>
            </li>
            <li>
              <Link to="/reports" className="nav-link text-white">
                <FileText size={18} className="me-2" />
                Reports
              </Link>
            </li>
          </>
        );
      case "librarian":
        return (
          <>
            <li>
              <Link to="/librarian-dashboard" className="nav-link text-white">
                <LayoutDashboard size={18} className="me-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/books" className="nav-link text-white">
                <BookOpen size={18} className="me-2" />
                Manage books
              </Link>
            </li>
            <li>
              <Link to="/borrow-requests" className="nav-link text-white">
                <FileText size={18} className="me-2" />
                Borrow Requests
              </Link>
            </li>
          </>
        );

      case "faculty":
        return (
          <>
            <li>
              <Link to="/faculty-dashboard" className="nav-link text-white">
                <LayoutDashboard size={18} className="me-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/reading-lists" className="nav-link text-white">
                Reading Lists
              </Link>
            </li>
            <li>
              <Link to="/student-access" className="nav-link text-white">
                Student Monitoring
              </Link>
            </li>
          </>
        );
      case "student":
        return (
          <>
            <li>
              <Link to="/student-dashboard" className="nav-link text-white">
                <LayoutDashboard size={18} className="me-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/my-books" className="nav-link text-white">
                <BookOpen size={18} className="me-2" />
                My Books
              </Link>
            </li>
            <li>
              <Link to="/borrowed-books" className="nav-link text-white">
                <FileText size={18} className="me-2" />
                Borrowed Books
              </Link>
            </li>

            <li>
              <Link to="/profile" className="nav-link text-white">
                <User size={18} className="me-2" />
                My Profile
              </Link>
            </li>
          </>
        );
      case "guest":
      default:
        return (
          <li>
            <Link to="/guest-dashboard" className="nav-link text-white">
              <Search size={18} className="me-2" />
              Browse Books
            </Link>
          </li>
        );
    }
  };

  return (
    <div
      className="d-flex"
      style={{ height: "100vh", backgroundColor: "#121212", color: "white" }}
    >
      {/* Sidebar */}
      <aside
        className="bg-dark p-3 d-flex flex-column"
        style={{ width: "250px" }}
      >
        {/* Logo + Title Inline */}
        <div className="d-flex align-items-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1048/1048927.png"
            alt="Logo"
            width="30"
            height="30"
            className="me-2"
            style={{ objectFit: "contain" }}
          />
          <h5 className="text-white mb-0">eLibrary</h5>
        </div>

        <ul className="nav flex-column mb-auto">{renderMenuItems()}</ul>
        <button
          className="btn btn-outline-danger mt-auto w-100"
          onClick={handleLogout}
        >
          <LogOut size={18} className="me-2" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-auto">
        {/* Top Navbar */}
        <div
          className="d-flex justify-content-end align-items-center p-3 bg-dark shadow-sm animate__animated animate__fadeInDown"
          style={{ borderBottom: "1px solid #2c2c2c" }}
        >
          <div className="d-flex align-items-center gap-4">
            {/* Notification Icon */}
            <div className="position-relative">
              <i className="bi bi-bell-fill text-warning fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3<span className="visually-hidden">unread messages</span>
              </span>
            </div>

            {/* Username + Icon */}
            <div className="d-flex align-items-center gap-2">
              <UserCircle2 size={24} className="text-light" />
              <span className="text-white fw-semibold">
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
    </div>
  );
}
