import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Search,
  ArrowDownUp,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import 'animate.css';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const allRequests = JSON.parse(localStorage.getItem('borrowRequests')) || [];
    const studentRequests = allRequests.filter(r => r.studentId === currentUser?.userId);
    setBooks(storedBooks);
    setRequests(studentRequests);
  }, []);

  const hasRequested = (bookId) =>
    requests.some(req => req.bookId === bookId && req.status !== 'Returned');

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
      status: 'Requested'
    };

    const allRequests = JSON.parse(localStorage.getItem('borrowRequests')) || [];
    allRequests.push(newRequest);
    localStorage.setItem('borrowRequests', JSON.stringify(allRequests));

    setRequests(prev => [...prev, newRequest]);
    setModalText(`Successfully requested "${book.title}"`);
    setShowModal(true);
  };

  const filtered = books
    .filter((b) => {
      if (filter === 'requested') return hasRequested(b.bookId);
      return true;
    })
    .filter((b) =>
      [b.title, b.author, b.description]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'date') return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
      return 0;
    });

  // Pagination logic
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

      {/* Book Table */}
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
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.map((b, i) => (
              <tr key={b.bookId} className="animate__animated animate__fadeInUp">
                <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                <td>{b.title}</td>
                <td>{b.type}</td>
                <td>{b.author}</td>
                <td>{b.description}</td>
                <td>
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
                        <BookOpen size={16} className="me-1" /> Request Book
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link bg-dark text-white border-secondary"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft size={16} />
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button
                  className="page-link bg-dark text-white border-secondary"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link bg-dark text-white border-secondary"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-body text-center">
                <p>{modalText}</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-light" onClick={() => setShowModal(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
