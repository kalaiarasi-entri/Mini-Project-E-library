import React, { useEffect, useState } from "react";
import { RotateCw, Clock, Search, Filter, CalendarDays } from "lucide-react";
import "animate.css";

export default function BorrowedBooks() {
  const [requests, setRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterBy, setFilterBy] = useState("all");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    const studentRequests = allRequests.filter((r) => r.studentId === currentUser?.email);
    const allBooks = JSON.parse(localStorage.getItem("books")) || [];

    const filteredRequests = studentRequests.filter((req) =>
      allBooks.find((book) => book.bookId === req.bookId)
    );

    setRequests(filteredRequests);
    setBooks(allBooks);
  }, []);

  const openReturnModal = (req) => {
    setSelectedRequest(req);
    setShowReturnModal(true);
  };

  const handleReturnConfirm = () => {
    const updatedRequests = [...requests];
    const index = updatedRequests.findIndex(
      (r) => r.bookId === selectedRequest.bookId && r.status === "Borrowed"
    );

    if (index !== -1) {
      updatedRequests[index].status = "Returned";
      updatedRequests[index].returnDate = new Date().toISOString();
    }

    const allRequests = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    const globalIndex = allRequests.findIndex(
      (r) =>
        r.bookId === selectedRequest.bookId &&
        r.studentId === currentUser.email &&
        r.status === "Borrowed"
    );

    if (globalIndex !== -1) {
      allRequests[globalIndex].status = "Returned";
      allRequests[globalIndex].returnDate = new Date().toISOString();
      localStorage.setItem("borrowRequests", JSON.stringify(allRequests));
    }

    setRequests(updatedRequests);
    setShowReturnModal(false);
  };

  const getBook = (bookId) => books.find((b) => b.bookId === bookId);
  const getBookTitle = (bookId) => getBook(bookId)?.title || "Unknown";

  const getStatusBadge = (status) => {
    const badgeClass =
      {
        Requested: "bg-warning text-dark",
        Borrowed: "bg-success",
        Returned: "bg-secondary",
      }[status] || "bg-light text-dark";
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const filtered = requests
    .filter((r) => {
      const bookTitle = getBookTitle(r.bookId).toLowerCase();
      return bookTitle.includes(search.toLowerCase());
    })
    .filter((r) => {
      if (filterBy === "requested") return !!r.requestDate;
      if (filterBy === "approved") return !!r.approvedDate;
      if (filterBy === "returned") return !!r.returnDate;
      return true;
    })
    .sort((a, b) => {
      const aBook = getBook(a.bookId);
      const bBook = getBook(b.bookId);
      if (sortBy === "title") return (aBook?.title || "").localeCompare(bBook?.title || "");
      if (sortBy === "requestedDate") return new Date(b.requestDate) - new Date(a.requestDate);
      if (sortBy === "approvedDate") return new Date(b.approvedDate || 0) - new Date(a.approvedDate || 0);
      if (sortBy === "returnDate") return new Date(b.returnDate || 0) - new Date(a.returnDate || 0);
      return 0;
    });

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      {/* Search, Sort, Filter Controls */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <label className="form-label text-white d-flex gap-2 align-items-center">
            <Search size={18} /> Search Title
          </label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-dark text-white border-secondary">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search book title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label text-white d-flex gap-2 align-items-center">
            <Filter size={18} /> Filter by Date
          </label>
          <select
            className="form-select bg-dark text-white border-secondary shadow-sm"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All</option>
            <option value="requested">Requested Only</option>
            <option value="approved">Approved Only</option>
            <option value="returned">Returned Only</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label text-white d-flex gap-2 align-items-center">
            <CalendarDays size={18} /> Sort by
          </label>
          <select
            className="form-select bg-dark text-white border-secondary shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="requestedDate">Requested Date</option>
            <option value="approvedDate">Approved Date</option>
            <option value="returnDate">Returned Date</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Requested</th>
              <th>Approved</th>
              <th>Returned</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-white">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filtered.map((req, i) => {
                const book = getBook(req.bookId);
                return (
                  <tr key={i} className="animate__animated animate__fadeInUp">
                    <td>{i + 1}</td>
                    <td>{book?.title || <em className="text-danger">Deleted</em>}</td>
                    <td>{formatDate(req.requestDate)}</td>
                    <td>{formatDate(req.approvedDate)}</td>
                    <td>{formatDate(req.returnDate)}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={req.status !== "Borrowed"}
                        onClick={() => openReturnModal(req)}
                      >
                        <RotateCw size={16} className="me-1" /> Return
                      </button>
                      {req.status === "Borrowed" && book?.fileURL && (
                        <a
                          href={book.fileURL}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-success btn-sm"
                          title="View Book File"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Return Confirmation Modal */}
      {showReturnModal && (
        <div
          className="modal d-block fade show animate__animated animate__fadeIn"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Return</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to return{" "}
                <strong>{getBookTitle(selectedRequest?.bookId)}</strong>?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReturnModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleReturnConfirm}
                >
                  <Clock size={16} className="me-1" /> Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
