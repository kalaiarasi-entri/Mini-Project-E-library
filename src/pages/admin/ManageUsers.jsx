import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash, Plus } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("usersByRole")) || {};
    const merged = [];

    Object.keys(stored).forEach((role) => {
      stored[role].forEach((user) => {
        merged.push({ ...user, role, userId: user.userId || user.id || "-" });
      });
    });
    //show without current user
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const filtered = merged.filter((user) => user.userId !== currentUser?.userId);
    setUsers(filtered);
  }, []);

  useEffect(() => {
    const filtered = users
      .filter((u) => (roleFilter ? u.role === roleFilter : true))
      .filter((u) =>
        search.trim()
          ? u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .sort((a, b) =>
        a[sortBy]?.toString().localeCompare(b[sortBy]?.toString())
      );

    setFilteredUsers(filtered);
  }, [users, search, sortBy, roleFilter]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    setFormData({
      userId: Date.now().toString(),
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      department: "",
    });
    setEditMode(false);
    setShowFormModal(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      ...user,
      confirmPassword: user.password,
    });
    setEditMode(true);
    setShowFormModal(true);
  };

  const handleDeleteUser = () => {
    const updated = users.filter((u) => u.userId !== userToDelete.userId);
    updateLocalStorage(updated);
    setUsers(updated);
    toast.success("User deleted successfully");
    setShowDeleteConfirm(false);
  };

  const handleSubmit = () => {
    const updatedUsers = editMode
      ? users.map((u) => (u.userId === formData.userId ? formData : u))
      : [...users, formData];

    updateLocalStorage(updatedUsers);
    setUsers(updatedUsers);
    setShowFormModal(false);
    toast.success(editMode ? "User updated" : "User added");
  };

  const updateLocalStorage = (updated) => {
    const grouped = updated.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push({ ...user });
      return acc;
    }, {});
    localStorage.setItem("usersByRole", JSON.stringify(grouped));
  };

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      <h3 className="text-white mb-4">Manage Users</h3>
      <ToastContainer theme="dark" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-success" onClick={handleAddUser}>
          <Plus className="me-1" size={18} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              className="form-control bg-dark  border-secondary text-white"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-white">
              <i className="bi bi-arrow-down-up"></i>
            </span>
            <select
              className="form-select bg-dark border-secondary text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="username">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-white">
              <i className="bi bi-filter-circle"></i>
            </span>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.userId}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setUserToDelete(user);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="animate__animated animate__fadeInDown"
      >
        <Modal.Header closeButton className="bg-dark text-white"  closeVariant="white">
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedUser && (
            <>
              <p>
                <strong>User ID:</strong> {selectedUser.userId}
              </p>
              <p>
                <strong>Name:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              {selectedUser.role === "student" && (
                <p>
                  <strong>Department:</strong> {selectedUser.department}
                </p>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        centered
        className="animate__animated animate__zoomIn"
      >
        <Modal.Header closeButton className="bg-dark text-white" closeVariant="white">
          <Modal.Title>{editMode ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                type="password"
                placeholder="Enter password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                type="password"
                placeholder="Confirm password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            {formData.role === "student" && (
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="IT">Information Technology</option>
                </Form.Select>
              </Form.Group>
            )}
            <Button variant="success" onClick={handleSubmit}>
              {editMode ? "Update" : "Add"} User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          Are you sure you want to delete{" "}
          <strong>{userToDelete?.username}</strong>?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
