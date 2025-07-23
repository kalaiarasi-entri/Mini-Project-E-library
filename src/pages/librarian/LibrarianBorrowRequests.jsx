import React, { useEffect, useState } from "react";
import { CheckCircle, Search, ArrowDownUp, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import "animate.css";

export default function LibrarianBorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [usersByRole, setUsersByRole] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sortBy, setSortBy] = useState("book");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    const allBooks = JSON.parse(localStorage.getItem("books")) || [];
    const userRoles = JSON.parse(localStorage.getItem("usersByRole")) || {};
    const loggedIn = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(loggedIn);
    setRequests(allRequests);
    setBooks(allBooks);
    setUsersByRole(userRoles);
  }, []);

  const getBookTitle = (bookId) => books.find((b) => b.bookId === bookId)?.title || null;

  const getStudentName = (studntId) => usersByRole?.student?.find((u) => u.userId === studntId)?.username || null;

  const openApproveModal = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleApprove = () => {
    const updated = requests.map((r) =>
      r.bookId === selectedRequest.bookId &&
      r.studentId === selectedRequest.studentId &&
      r.status === "Requested"
        ? {
            ...r,
            status: "Borrowed",
            approvedDate: new Date().toISOString(),
            approvedBy: currentUser?.userId,
          }
        : r
    );
    localStorage.setItem("borrowRequests", JSON.stringify(updated));
    setRequests(updated);
    toast.success(`Approved successfully`, {
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
    setShowModal(false);
  };

  const filtered = requests
    .filter((r) => getBookTitle(r.bookId) && getStudentName(r.studentId))
    .filter((r) => (filterStatus === "all" ? true : r.status === filterStatus))
    .filter((r) => {
      const bookTitle = getBookTitle(r.bookId)?.toLowerCase() || "";
      const studentName = getStudentName(r.studentId)?.toLowerCase() || "";
      return (
        bookTitle.includes(search.toLowerCase()) ||
        studentName.includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "book") {
        return getBookTitle(a.bookId)?.localeCompare(getBookTitle(b.bookId));
      }
      if (sortBy === "student") {
        return getStudentName(a.studentId)?.localeCompare(getStudentName(b.studentId));
      }
      if (sortBy === "approvedDate") {
        return new Date(b.approvedDate || 0) - new Date(a.approvedDate || 0);
      }
      if (sortBy === "returnDate") {
        return new Date(b.returnDate || 0) - new Date(a.returnDate || 0);
      }
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changePage = (direction) => {
    if (direction === "prev" && currentPage > 1) setCurrentPage((prev) => prev - 1);
    if (direction === "next" && currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      {/* Controls */}
<div className="p-3 rounded bg-black border border-secondary mb-4 shadow animate__animated animate__fadeInDown">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-md-4">
            <label
              htmlFor="searchInput"
              className="form-label d-flex align-items-center gap-2 text-white"
            >
              <Search size={18} /> Search
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-dark text-white border-secondary">
                <Search size={16} />
              </span>
              <input
                id="searchInput"
                name="search"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Search student or book..."
                style={{ "::placeholder": { color: "#ccc" } }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="col-md-4">
            <label
              htmlFor="sortSelect"
              className="form-label d-flex align-items-center gap-2 text-white"
            >
              <ArrowDownUp size={18} /> Sort
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-dark text-white border-secondary">
                <ArrowDownUp size={16} />
              </span>
              <select
                id="sortSelect"
                name="sortBy"
                className="form-select bg-dark text-white border-secondary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="book">Sort by Book</option>
                <option value="student">Sort by Student</option>
                <option value="approvedDate">Sort by Approved Date</option>
                <option value="returnDate">Sort by Return Date</option>
              </select>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="col-md-4">
            <label
              htmlFor="filterSelect"
              className="form-label d-flex align-items-center gap-2 text-white"
            >
              <Filter size={18} /> Filter
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-dark text-white border-secondary">
                <Filter size={16} />
              </span>
              <select
                id="filterSelect"
                name="filterStatus"
                className="form-select bg-dark text-white border-secondary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Requested">Requested</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table or Empty Message */}
      {paginated.length === 0 ? (
        <div className="text-center p-5 text-secondary fs-5 fst-italic border border-secondary rounded">
          No borrow requests found.
        </div>
      ) : (
        <>
          <table className="table table-dark table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Book</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Approved / Returned</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r, i) => (
                <tr key={i} className="animate__animated animate__fadeInUp">
                  <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td>{getStudentName(r.studentId)}</td>
                  <td>{getBookTitle(r.bookId)}</td>
                  <td>{formatDate(r.requestDate)}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "Requested"
                          ? "bg-warning text-dark"
                          : r.status === "Borrowed"
                          ? "bg-gradient bg-primary"
                          : "bg-success"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <small>
                      {r.approvedDate ? formatDate(r.approvedDate) : "Not approved"} → {" "}
                      {r.returnDate ? formatDate(r.returnDate) : "Not returned"}
                    </small>
                  </td>
                  <td>
                    {r.status === "Requested" ? (
                      <button
                        className="btn btn-success btn-sm animate__animated animate__pulse animate__infinite"
                        onClick={() => openApproveModal(r)}
                      >
                        <CheckCircle size={16} className="me-1" /> Approve
                      </button>
                    ) : (
                      <button className="btn btn-success btn-sm" disabled>
                        <CheckCircle size={16} className="me-1" /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
         {totalPages > 1 && (
  <div className="d-flex justify-content-center mt-4">
    <nav>
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

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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
  </div>
)}

        </>
      )}

      {/* Approval Modal */}
      {showModal && selectedRequest && (
        <div
          className="modal d-block fade show animate__animated animate__zoomIn"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Approve Borrow Request</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to approve the request for <strong>{getBookTitle(selectedRequest.bookId)}</strong> by <strong>{getStudentName(selectedRequest.studentId)}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleApprove}>
                  Approve Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
