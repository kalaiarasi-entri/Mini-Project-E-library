import React, { useEffect, useState } from 'react'
import { RotateCw, Clock } from 'lucide-react'
import 'animate.css'

export default function BorrowedBooks() {
  const [requests, setRequests] = useState([])
  const [books, setBooks] = useState([])
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('borrowRequests')) || []
    const studentRequests = allRequests.filter((r) => r.studentId === currentUser?.email)
    const allBooks = JSON.parse(localStorage.getItem('books')) || []

    // Filter requests to only show those with existing books
    const filteredRequests = studentRequests.filter(req =>
      allBooks.find(book => book.bookId === req.bookId)
    )

    setRequests(filteredRequests)
    setBooks(allBooks)
  }, [])

  const openReturnModal = (req) => {
    setSelectedRequest(req)
    setShowReturnModal(true)
  }

  const handleReturnConfirm = () => {
    const updatedRequests = [...requests]
    const index = updatedRequests.findIndex(
      (r) => r.bookId === selectedRequest.bookId && r.status === 'Borrowed'
    )

    if (index !== -1) {
      updatedRequests[index].status = 'Returned'
      updatedRequests[index].returnDate = new Date().toISOString()
    }

    // Save globally
    const allRequests = JSON.parse(localStorage.getItem('borrowRequests')) || []
    const globalIndex = allRequests.findIndex(
      (r) =>
        r.bookId === selectedRequest.bookId &&
        r.studentId === currentUser.email &&
        r.status === 'Borrowed'
    )

    if (globalIndex !== -1) {
      allRequests[globalIndex].status = 'Returned'
      allRequests[globalIndex].returnDate = new Date().toISOString()
      localStorage.setItem('borrowRequests', JSON.stringify(allRequests))
    }

    setRequests(updatedRequests)
    setShowReturnModal(false)
  }

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      <h3 className="mb-4">My Borrowed / Requested Books</h3>

      {requests.length === 0 ? (
        <p className="text-muted text-center">No records found.</p>
      ) : (
        <table className="table table-dark table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Requested Date</th>
              <th>Status</th>
              <th>Return</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => {
              const book = books.find(b => b.bookId === req.bookId)
              return (
                <tr key={req.bookId} className="animate__animated animate__fadeInUp">
                  <td>{i + 1}</td>
                  <td>{book ? book.title : <em className="text-danger">Deleted</em>}</td>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td>{req.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      disabled={req.status !== 'Borrowed'}
                      onClick={() => openReturnModal(req)}
                    >
                      <RotateCw size={16} className="me-1" /> Return
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div
          className="modal d-block fade show animate__animated animate__fadeIn"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Return</h5>
              </div>
              <div className="modal-body">
                Return <strong>{selectedRequest?.bookTitle}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleReturnConfirm}>
                  <Clock size={16} className="me-1" /> Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
