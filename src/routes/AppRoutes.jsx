import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

import AdminDashboard from "../pages/dashboards/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminReports from "../pages/admin/AdminReports";
import LibrarianDashboard from "../pages/dashboards/LibrarianDashboard";
import StudentDashboard from "../pages/dashboards/StudentDashboard";
import GuestDashboard from "../pages/dashboards/GuestDashboard";
import FacultyDashboard from "../pages/dashboards/FacultyDashboard";
import ManageBooks from "../pages/librarian/ManageBooks";
import MyBooks from "../pages/student/MyBooks";
import BorrowedBooks from "../pages/student/BorrowedBook";
import LibrarianBorrowRequests from "../pages/librarian/LibrarianBorrowRequests";
import StudentDetails from "../pages/faculty/StudentDetails";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Wrap everything that requires layout inside one layout */}
      <Route element={<Layout />}>
        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-reports"
          element={
            <ProtectedRoute allowedRoles={["admin","faculty"]}>
              <AdminReports  />
            </ProtectedRoute>
          }
        />

        {/* Librarian Routes */}
        <Route
          path="/librarian-dashboard"
          element={
            <ProtectedRoute allowedRoles={["librarian"]}>
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute allowedRoles={["librarian","admin","faculty"]}>
              <ManageBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrow-requests"
          element={
            <ProtectedRoute allowedRoles={["librarian"]}>
              <LibrarianBorrowRequests />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
         <Route
          path="/my-books"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrowed-books"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <BorrowedBooks />
            </ProtectedRoute>
          }
        />
        {/* Faculty Routes */}
        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students-details"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <StudentDetails  />
            </ProtectedRoute>
          }
        />

        {/* Guest Routes */}
        <Route
          path="/guest-dashboard"
          element={
            <ProtectedRoute allowedRoles={["guest"]}>
              <GuestDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
