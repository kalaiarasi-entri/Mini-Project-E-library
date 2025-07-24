import React, { useEffect, useState } from "react";
import {
  RotateCw,
  Clock,
  Star,
  Search,
  Filter,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "animate.css";

export default function ReturnedBooks() {
  const [requests, setRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [usersByRole, setUsersByRole] = useState({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    const returned = allRequests.filter(
      (r) =>
        r.studentId === currentUser?.userId &&
        r.status === "Returned"
    );

    const allBooks = JSON.parse(localStorage.getItem("books")) || [];
    const allUsers = JSON.parse(localStorage.getItem("usersByRole")) || {};

    setRequests(returned);
    setBooks(allBooks);
    setUsersByRole(allUsers);
  }, []);

  const getBook = (bookId) => books.find((b) => b.bookId === bookId);
  const getBookTitle = (bookId) => getBook(bookId)?.title || "Unknown";

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const filtered = requests
    .filter((r) => {
      const bookTitle = getBookTitle(r.bookId).toLowerCase();
      return bookTitle.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const aBook = getBook(a.bookId);
      const bBook = getBook(b.bookId);
      if (sortBy === "title")
        return (aBook?.title || "").localeCompare(bBook?.title || "");
      if (sortBy === "returnDate")
        return new Date(b.returnDate || 0) - new Date(a.returnDate || 0);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRequests = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openRatingModal = (book) => {
    setSelectedBook(book);
    setRating(0);
    setComment("");
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    if (!selectedBook || rating === 0) return;

    const updatedBooks = books.map((b) => {
      if (b.bookId === selectedBook.bookId) {
        const newRating = {
          studentId: currentUser.userId,
          rating,
          comment,
        };
        return {
          ...b,
          ratings: [...(b.ratings || []), newRating],
        };
      }
      return b;
    });

    localStorage.setItem("books", JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
    setShowRatingModal(false);
  };

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      <h4 className="mb-4">Returned Books</h4>

      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <label className="form-label text-white d-flex gap-2 align-items-center">
            <Search size={18} /> Search Title
          </label>
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary shadow-sm"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-white d-flex gap-2 align-items-center">
            <CalendarDays size={18} /> Sort by
          </label>
          <select
            className="form-select bg-dark text-white border-secondary shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="returnDate">Returned Date</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Returned On</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-white">
                  No returned books found.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((req, i) => {
                const book = getBook(req.bookId);
                return (
                  <tr key={i} className="animate__animated animate__fadeInUp">
                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td>{book?.title || <em className="text-danger">Deleted</em>}</td>
                    <td>{formatDate(req.returnDate)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => openRatingModal(book)}
                      >
                        <Star size={16} className="me-1" />
                        Give Rating
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

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
                  <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
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
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div
          className="modal d-block fade show animate__animated animate__fadeIn"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Rate {selectedBook?.title}</h5>
              </div>
              <div className="modal-body">
                <label className="form-label">Rating (1 to 5):</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                />

                <label className="form-label">Comment:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRatingModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleRatingSubmit}>
                  <Clock size={16} className="me-1" /> Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
