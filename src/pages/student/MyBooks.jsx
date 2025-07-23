import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Search,
  ArrowDownUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
} from "lucide-react";
import "animate.css";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    const allRequests =
      JSON.parse(localStorage.getItem("borrowRequests")) || [];
    const studentRequests = allRequests.filter(
      (r) => r.studentId === currentUser?.userId
    );
    setBooks(storedBooks);
    setRequests(studentRequests);
  }, []);

  const hasRequested = (bookId) =>
    requests.some((req) => req.bookId === bookId && req.status !== "Returned");

  const getExistingRating = (bookId) => {
  const ratings = JSON.parse(localStorage.getItem("bookRatings")) || [];
  return ratings.find(
    (r) => r.bookId === bookId && r.studentId === currentUser.userId
  );
};

  const handleRequest = (book) => {
    if (hasRequested(book.bookId)) {
      setModalText(`You have already requested "${book.title}"`);
      setShowModal(true);
      return;
    }

    const newRequest = {
      bookId: book.bookId,
      studentId: currentUser.userId,
      bookTitle: book.title,
      requestDate: new Date().toISOString(),
      status: "Requested",
    };

    const allRequests =
      JSON.parse(localStorage.getItem("borrowRequests")) || [];
    allRequests.push(newRequest);
    localStorage.setItem("borrowRequests", JSON.stringify(allRequests));

    setRequests((prev) => [...prev, newRequest]);
    setModalText(`Successfully requested "${book.title}"`);
    setShowModal(true);
  };

  const openRatingModal = (book) => {
    setSelectedBook(book);
    const existing = getExistingRating(book.bookId);
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
    } else {
      setRating(0);
      setComment("");
    }
    setRatingModalOpen(true);
  };

  const openDetailModal = (book) => {
    setSelectedBook(book);
    setDetailModalOpen(true);
  };

  const handleRatingSubmit = () => {
    const allRatings = JSON.parse(localStorage.getItem("bookRatings")) || [];
    const updatedRatings = allRatings.filter(
      (r) =>
        !(
          r.bookId === selectedBook.bookId && r.studentId === currentUser.userId
        )
    );

    updatedRatings.push({
      bookId: selectedBook.bookId,
      studentId: currentUser.userId,
      rating,
      comment,
      date: new Date().toISOString(),
    });

    localStorage.setItem("bookRatings", JSON.stringify(updatedRatings));
    setRatingModalOpen(false);
  };

  const filtered = books
    .filter((b) => {
      if (filter === "requested") return hasRequested(b.bookId);
      return true;
    })
    .filter((b) =>
      [b.title, b.author, b.description]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "date")
        return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedBooks = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      {/* Search, Sort, Filter Controls */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label d-flex gap-2 align-items-center">
            <Search size={18} /> Search
          </label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-dark text-white border-secondary">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search by title, author or description"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
            />
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label d-flex gap-2 align-items-center">
            <ArrowDownUp size={18} /> Sort By
          </label>
          <select
            className="form-select bg-dark text-white border-secondary shadow-sm"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); // reset page on sort
            }}
          >
            <option value="title">Title</option>
            <option value="date">Added Date</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label d-flex gap-2 align-items-center">
            <Filter size={18} /> Filter
          </label>
          <select
            className="form-select bg-dark text-white border-secondary shadow-sm"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // reset page on filter
            }}
          >
            <option value="all">All Books</option>
            <option value="requested">Requested Only</option>
          </select>
        </div>
      </div>

      {paginatedBooks.length === 0 ? (
        <div className="text-center p-5 text-white fs-5 fst-italic border border-secondary rounded">
          No books available.
        </div>
      ) : (
        <table className="table table-dark table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Author</th>
              <th>Actions</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.map((b, i) => {
              const existingRating = getExistingRating(b.bookId);
              return (
                <tr
                  key={b.bookId}
                  className="animate__animated animate__fadeInUp"
                >
                  <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td>{b.title}</td>
                  <td>{b.type}</td>
                  <td>{b.author}</td>
                  <td className=" d-flex justify-content-evenly">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openDetailModal(b)}
                    >
                      <Eye size={18} color="#f5f1f1" />
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={hasRequested(b.bookId)}
                      onClick={() => handleRequest(b)}
                    >
                      {hasRequested(b.bookId) ? (
                        <>
                          <CheckCircle size={16} className="me-1" /> Requested
                        </>
                      ) : (
                        <>
                          <BookOpen size={16} className="me-1" /> Request
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => openRatingModal(b)}
                    >
                      {existingRating ? "Edit Rating" : "Give Rating"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link bg-dark text-white border-secondary"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                <ChevronRight size={16} />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="modal d-block fade show animate__animated animate__fadeIn"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-body text-center">
                <p>{modalText}</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModalOpen && (
        <div
          className="modal d-block fade show animate__animated animate__fadeIn"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Rate: {selectedBook?.title}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setRatingModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Your Rating</label>
                <div className="mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      fill={star <= rating ? "#facc15" : "none"}
                      stroke="#facc15"
                      style={{ cursor: "pointer" }}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <label className="form-label">Your Comment</label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setRatingModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleRatingSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedBook && (
        <div
          className="modal d-block fade show animate__animated animate__fadeIn"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Book Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDetailModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h4 className="fw-bold mb-3 text-info border-bottom pb-2">
                  {selectedBook.title}
                </h4>

                <div className="mb-2">
                  <span className="fw-semibold text-secondary">Type:</span>{" "}
                  <span className="text-light">{selectedBook.type}</span>
                </div>

                <div className="mb-2">
                  <span className="fw-semibold text-secondary">Author:</span>{" "}
                  <span className="text-light">{selectedBook.author}</span>
                </div>

                <div className="mb-3">
                  <span className="fw-semibold text-secondary">
                    Description:
                  </span>
                  <div className="text-white mt-1">
                    {selectedBook.description}
                  </div>
                </div>

                {getExistingRating(selectedBook.bookId) && (
                  <div className="mt-4 p-3 rounded border border-secondary bg-black bg-opacity-50">
                    <h6 className="text-warning mb-2">Your Rating</h6>
                    <div className="text-warning fs-4 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= getExistingRating(selectedBook.bookId).rating
                            ? "★"
                            : "☆"}
                        </span>
                      ))}
                    </div>
                    <div className="fst-italic text-light border-top pt-2">
                      “{getExistingRating(selectedBook.bookId).comment}”
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setDetailModalOpen(false)}
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
