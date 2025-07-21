import React, { useEffect, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "react-bootstrap";
import "animate.css";

export default function StudentDetails() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("usersByRole")) || {};
    const studentList = (stored.student || []).map((user) => ({
      ...user,
      userId: user.userId || user.id || "-",
    }));
    setStudents(studentList);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  const filteredStudents = students
    .filter((u) =>
      search.trim()
        ? u.username?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) =>
      sortBy === "createdAt"
        ? new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        : a[sortBy]?.toString().localeCompare(b[sortBy]?.toString())
    );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-4 text-white animate__animated animate__zoomIn">
      {/* Search & Sort */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-white">
              <i className="bi bi-search" />
            </span>
            <input
              className="form-control bg-dark border-secondary text-white"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-white">
              <i className="bi bi-arrow-down-up" />
            </span>
            <select
              className="form-select bg-dark border-secondary text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Newest</option>
              <option value="username">Name</option>
              <option value="email">Email</option>
              <option value="department">Department</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((user, index) => (
                <tr key={user.userId}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.department || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link bg-dark text-white border-secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} />
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button
                  className="page-link bg-dark text-white border-secondary"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link bg-dark text-white border-secondary"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <ChevronRight size={16} />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="animate__animated animate__fadeInDown"
      >
        <Modal.Header
          closeButton
          className="bg-dark text-white"
          closeVariant="white"
        >
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedUser && (
            <>
              <p>
                <strong>User ID:</strong> {selectedUser.userId}
              </p>
              <p>
                <strong>Name:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Department:</strong> {selectedUser.department}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
