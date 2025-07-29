import React, { useEffect, useState } from "react";
import { Search, Filter, ArrowDownUp, Eye } from "lucide-react";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Admin.css"; // Or wherever you placed flip card styles

export default function AdminReports() {
  const [users, setUsers] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const storedUsersByRole =
      JSON.parse(localStorage.getItem("usersByRole")) || {};
    const storedUsers = Object.values(storedUsersByRole).flat();
    const storedRequests =
      JSON.parse(localStorage.getItem("borrowRequests")) || [];
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    setUsers(storedUsers);
    setBorrowRequests(storedRequests);
    setBooks(storedBooks);
  }, []);

  const students = users.filter((u) => u.role === "student");
  const departments = [...new Set(students.map((u) => u.department))];

  const filtered = students.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment
      ? u.department === selectedDepartment
      : true;
    return matchesSearch && matchesDept;
  });

  const borrowCount = (user) =>
    borrowRequests.filter((r) => r.studentId === user.userId).length;

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "username") return a.username.localeCompare(b.username);
    if (sortKey === "borrowed") return borrowCount(b) - borrowCount(a);
    return 0;
  });

  const visibleUsers = sorted.slice(0, visibleCount);

  const getBookName = (bookId) => {
    const book = books.find((b) => b.bookId === bookId);
    return book ? book.title : "Unknown Book";
  };

  const getStatusBadge = (status) => {
    if (status === "Requested") return "secondary";
    if (status === "Borrowed") return "success";
    if (status === "Returned") return "light text-dark";
    return "dark";
  };

  return (
    <div className="container mt-4 text-white">
      {/* Search, Filter, Sort */}
      <div className="d-flex flex-wrap gap-5 mb-4">
        <div className="input-group w-auto">
          <span className="input-group-text bg-dark text-white border-secondary">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by name or email"
            className="form-control bg-dark text-white border-secondary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="input-group w-auto">
          <span className="input-group-text bg-dark text-white border-secondary">
            <Filter size={16} />
          </span>
          <select
            className="form-select bg-dark text-white border-secondary"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group w-auto">
          <span className="input-group-text bg-dark text-white border-secondary">
            <ArrowDownUp size={16} />
          </span>
          <select
            className="form-select bg-dark text-white border-secondary"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="username">Name</option>
            <option value="borrowed">Borrowed Count</option>
          </select>
        </div>
      </div>

      {/* Flip Cards */}
      { visibleUsers.length>0?(
      <div className="row g-4 mt-4">
        {visibleUsers.map((user, idx) => (
          <div key={idx} className="col-md-4 mb-4">
            <div className="flip-card">
              <div className="flip-card-inner">
                {/* Front */}
                <div className="flip-card-front">
                  <div>
                    <h5 className="text-uppercase">{user.username}</h5>

                    <div className="info">
                      <div className="mb-2">
                        <i className="bi bi-envelope-fill text-info me-2"></i>
                        {user.email}
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-building text-warning me-2"></i>
                        <strong>Dept:</strong>{" "}
                        <span className="badge bg-secondary text-light">
                          {user.department}
                        </span>
                      </div>
                      <div>
                        <i className="bi bi-journal-bookmark-fill text-success me-2"></i>
                        <strong>Books:</strong> {borrowCount(user)}
                      </div>
                    </div> 
                  </div>
                  <div className="hover-hint mt-0">⟶ Hover to flip</div>
                </div>

                {/* Back */}
                <div className="flip-card-back">
                  <h6 className="fw-semibold mb-4">Borrow History</h6>
                  <div
                    className="position-absolute bottom-2 end-2 p-2 rounded-circle bg-light bg-opacity-10 mt-5"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>):(<p className="text-white text-center mt-4">No Records Found</p>)}

      {/* Load More */}
      {visibleCount < sorted.length && (
        <div className="text-center mt-4">
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setVisibleCount(visibleCount + 6)}
          >
            Load More
          </button>
        </div>
      )}

      {/* View Modal */}
      {selectedUser && (
        <div
          className="modal fade show d-block animate__animated animate__fadeInDown"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} // overlay effect
        >
          <div className="modal-dialog modal-lg">
            <div
              className="modal-content bg-dark text-white border-secondary rounded-4 shadow-lg"
              style={{
                background: "rgba(33, 37, 41, 0.9)", // dark + semi-transparent
                backdropFilter: "blur(8px)", // glass effect
              }}
            >
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-light text-capitalize">
                  {selectedUser.username}'s Borrow History
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Department:</strong> {selectedUser.department}
                </p>
                <hr />
                <h6 className="mb-3 text-warning">Books Borrowed:</h6>
                <ul className="list-group list-group-flush">
                  {borrowRequests
                    .filter((r) => r.studentId === selectedUser.userId)
                    .map((r, i) => (
                      <li
                        key={i}
                        className="list-group-item bg-dark text-white border-secondary"
                      >
                        <strong className="text-warning">
                          {getBookName(r.bookId)}
                        </strong>{" "}
                        <br />
                        Status:{" "}
                        <span
                          className={`badge bg-${getStatusBadge(
                            r.status
                          )} ms-1`}
                        >
                          {r.status}
                        </span>{" "}
                        | Date: {r.requestDate}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="modal-footer border-secondary">
                <button
                  className="btn btn-primary rounded-pill"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
