// src/pages/student/MyBooks.jsx
import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';
import 'animate.css';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const allRequests = JSON.parse(localStorage.getItem('borrowRequests')) || [];
    const studentRequests = allRequests.filter(r => r.studentId === currentUser?.email);
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
      studentId: currentUser.email,
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

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      <h3 className="mb-4">Available Books</h3>
      {books.length === 0 ? (
        <p className="text-muted text-center">No books available.</p>
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
            {books.map((b, i) => (
              <tr key={b.bookId} className="animate__animated animate__fadeInUp">
                <td>{i + 1}</td>
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
                        <CheckCircle size={16} className="me-1" /> Already Requested
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
