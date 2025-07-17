import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Plus } from 'lucide-react';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('usersByRole')) || {};
    let merged = [];

    Object.entries(stored).forEach(([role, list]) => {
      if (role !== 'student') {
        merged = [...merged, ...list.map(user => ({ ...user, role }))];
      }
    });

    setUsers(merged);
  }, []);

  const filtered = users
    .filter(user =>
      [user.name, user.email, user.role].some(field =>
String(field).toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter(user => filterRole === 'All' || user.role === filterRole)
.sort((a, b) => String(a[sortBy]).localeCompare(String(b[sortBy])))

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Manage Users</h3>
        <button className="btn btn-success">
          <Plus className="me-1" size={18} /> Add User
        </button>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select bg-dark text-white border-secondary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select bg-dark text-white border-secondary"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="faculty">Faculty</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </div>

      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-white">No users found</td>
            </tr>
          ) : (
            filtered.map((user, i) => (
              <tr key={user.userId || `${user.email}-${user.role}`}>
                <td>{i + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => { setSelectedUser(user); setShowModal(true); }}>
                    <Eye size={16} />
                  </button>
                  <button className="btn btn-secondary btn-sm" disabled>
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* View Modal */}
      {showModal && selectedUser && (
        <div className="modal d-block fade show animate__animated animate__zoomIn" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>User ID:</strong> {selectedUser.userId || 'N/A'}</p>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
