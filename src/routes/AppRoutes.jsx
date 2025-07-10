import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

import AdminDashboard from "../pages/dashboards/AdminDashboard";
import LibrarianDashboard from "../pages/dashboards/LibrarianDashboard";
import StudentDashboard from "../pages/dashboards/StudentDashboard";
import GuestDashboard from "../pages/dashboards/GuestDashboard";
import FacultyDashboard from "../pages/dashboards/FacultyDashboard";
import ManageBooks from "../pages/librarian/ManageBooks"; 


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin", "librarian", "student", "faculty", "guest"]}
          >
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/guest-dashboard" element={<GuestDashboard />} />

        {/* Librarian Book Management Page */}
        <Route path="/books" element={<ManageBooks />} />
      </Route>
    </Routes>
  );
}
