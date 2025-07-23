import React, { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Trash,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  //   pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const [formValidated, setFormValidated] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });

  useEffect(() => {
    if (showFormModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showFormModal]);

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
    const filtered = merged.filter(
      (user) => user.userId !== currentUser?.userId
    );
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
      role: "",
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
    toast.success(`user deleted succesfully`, {
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
    setShowDeleteConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      form.checkValidity() === false ||
      formData.password !== formData.confirmPassword
    ) {
      setFormValidated(true);
      return;
    }
    const updatedUsers = editMode
      ? users.map((u) => (u.userId === formData.userId ? formData : u))
      : [...users, formData];

    updateLocalStorage(updatedUsers);
    setUsers(updatedUsers);
    setShowFormModal(false);
    toast.success(`user added succesfully`, {
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
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr
                  key={user.userId}
                  className="animate__animated animate__fadeInUp"
                >
                  <td>{indexOfFirstUser + index + 1}</td>
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
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link bg-dark text-white border-secondary"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  <ChevronLeft size={16} />
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link bg-dark text-white border-secondary"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
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
      </div>

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="animate__animated animate__fadeInDown"
      >
        <Modal.Header
          closeButton
          className="bg-dark text-white"
          closeVariant="white"
        >
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
        scrollable
        enforceFocus={false} // ✅ Important fix
        className="animate__animated animate__zoomIn"
      >
        <Modal.Header
          closeButton
          className="bg-dark text-white"
          closeVariant="white"
        >
          <Modal.Title>{editMode ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form noValidate validated={formValidated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                placeholder="Enter name"
                required
                pattern="^[a-zA-Z ]{3,}$"
              />
              <Form.Control.Feedback type="invalid">
                Name must be at least 3 letters and contain only alphabets.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                type="email"
                placeholder="Enter email"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                type="password"
                placeholder="Enter password"
                required
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters and include uppercase,
                lowercase, and a number.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                type="password"
                placeholder="Confirm password"
                required
                isInvalid={formData.confirmPassword !== formData.password}
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="faculty">Faculty</option>
                <option value="librarian">Librarian</option>
                <option value="student">Student</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a role.
              </Form.Control.Feedback>
            </Form.Group>

            {formData.role === "student" && (
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="IT">Information Technology</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a department.
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Button variant="success" type="submit">
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
