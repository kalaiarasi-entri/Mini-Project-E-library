import React, { useEffect, useState } from 'react'
import { CheckCircle, Clock } from 'lucide-react'
import 'animate.css'

export default function LibrarianBorrowRequests() {
  const [requests, setRequests] = useState([])
  const [books, setBooks] = useState([])
  const [usersByRole, setUsersByRole] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('borrowRequests')) || []
    const allBooks = JSON.parse(localStorage.getItem('books')) || []
    const userRoles = JSON.parse(localStorage.getItem('usersByRole')) || {}

    setRequests(allRequests)
    setBooks(allBooks)
    setUsersByRole(userRoles)
  }, [])

  const getBookTitle = (bookId) => {
    return books.find(b => b.bookId === bookId)?.title || null
  }

  const getStudentName = (email) => {
    return usersByRole?.student?.find(u => u.email === email)?.username || null
  }

  const openApproveModal = (req) => {
    setSelectedRequest(req)
    setShowModal(true)
  }

  const handleApprove = () => {
    const updatedRequests = requests.map((r) =>
      r.bookId === selectedRequest.bookId &&
      r.studentId === selectedRequest.studentId &&
      r.status === 'Requested'
        ? { ...r, status: 'Borrowed', approvedDate: new Date().toISOString() }
        : r
    )

    localStorage.setItem('borrowRequests', JSON.stringify(updatedRequests))
    setRequests(updatedRequests)
    setShowModal(false)
  }

  // 🔍 Filter out requests where book or student doesn't exist anymore
  const filteredRequests = requests.filter(
    r => getBookTitle(r.bookId) && getStudentName(r.studentId)
  )

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      <h3 className="mb-4">Borrow Requests</h3>

      {filteredRequests.length === 0 ? (
        <p className="text-muted text-center">No valid borrow requests found.</p>
      ) : (
        <table className="table table-dark table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Book</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r, i) => (
              <tr key={i} className="animate__animated animate__fadeInUp">
                <td>{i + 1}</td>
                <td>{getStudentName(r.studentId)}</td>
                <td>{getBookTitle(r.bookId)}</td>
                <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                <td>
                  {r.status === 'Requested' ? (
                    <span className="badge bg-warning text-dark">Requested</span>
                  ) : r.status === 'Borrowed' ? (
                    <span className="badge bg-success">Borrowed</span>
                  ) : (
                    <span className="badge bg-info">Returned</span>
                  )}
                </td>
                <td>
                  {r.status === 'Requested' ? (
                    <button className="btn btn-success btn-sm" onClick={() => openApproveModal(r)}>
                      <CheckCircle size={16} className="me-1" /> Approve
                    </button>
                  ) : (
                    <span className="text-success">
                      <Clock size={14} className="me-1" />
                      {r.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Approval Modal */}
      {showModal && selectedRequest && (
        <div className="modal d-block fade show animate__animated animate__zoomIn" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Approve Borrow Request</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to approve the request for{' '}
                <strong>{getBookTitle(selectedRequest.bookId)}</strong> by{' '}
                <strong>{getStudentName(selectedRequest.studentId)}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleApprove}>Approve Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
