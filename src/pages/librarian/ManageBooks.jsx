import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterType, setFilterType] = useState('All');
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    type: '',
    description: '',
    author: '',
    file: null,
    fileName: '',
    fileURL: '',
    createdAt: '',
    createdBy: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('books')) || [];
    setBooks(stored);
  }, []);

  const resetForm = () => {
    setFormData({
      bookId: '',
      title: '',
      type: '',
      description: '',
      author: '',
      file: null,
      fileName: '',
      fileURL: '',
      createdAt: '',
      createdBy: ''
    });
    setEditIndex(null);
  };

  const openModal = (bookId = null) => {
    if (bookId) {
      const index = books.findIndex(b => b.bookId === bookId);
      const book = books[index];
      setFormData({
        ...book,
        file: null
      });
      setEditIndex(index);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = () => {
    const updated = books.filter((_, i) => i !== deleteIndex);
    setBooks(updated);
    localStorage.setItem('books', JSON.stringify(updated));
    setShowConfirm(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileURL: URL.createObjectURL(file)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const book = {
      ...formData,
      bookId: formData.bookId || crypto.randomUUID(),
      createdAt: formData.createdAt || new Date().toISOString(),
      createdBy: currentUser?.username || 'Unknown'
    };

    const updated = [...books];
    if (editIndex !== null) {
      updated[editIndex] = book;
    } else {
      updated.push(book);
    }

    setBooks(updated);
    localStorage.setItem('books', JSON.stringify(updated));
    closeModal();
  };

  const filtered = books
    .filter((b) =>
      [b.title, b.author, b.type].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter((b) => filterType === 'All' || b.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'createdAt') return new Date(a.createdAt) - new Date(b.createdAt); // newer last
      return a[sortBy].localeCompare(b[sortBy]);
    });

  return (
    <div className="container mt-4 text-white animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-success" onClick={() => openModal()}>
          <Plus className="me-1" size={18} /> Add Book
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
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search by title, author, or type"
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
              className="form-select bg-dark text-white border-secondary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="type">Sort by Type</option>
              <option value="createdAt">Sort by Created Date</option>
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Books">Books</option>
              <option value="Journals">Journals</option>
              <option value="Research Papers">Research Papers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <table className="table table-dark table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Author</th>
            <th>Description</th>
            <th>File</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center text-white">No records found</td>
            </tr>
          ) : (
            filtered.map((b, i) => (
              <tr key={b.bookId} className="animate__animated animate__fadeInUp">
                <td>{i + 1}</td>
                <td>{b.title}</td>
                <td>{b.type}</td>
                <td>{b.author}</td>
                <td>{b.description}</td>
                <td>
                  {b.fileURL ? (
                    <a href={b.fileURL} target="_blank" rel="noreferrer">View</a>
                  ) : 'N/A'}
                </td>
                <td>{b.createdBy}</td>
                <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => openModal(b.bookId)}>
                    <Pencil size={16} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(books.findIndex(book => book.bookId === b.bookId))}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal d-block fade show animate__animated animate__zoomIn" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">{editIndex !== null ? 'Edit Book' : 'Add Book'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      name="title"
                      placeholder="Book Title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Books">Books</option>
                      <option value="Journals">Journals</option>
                      <option value="Research Papers">Research Papers</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <textarea
                      className="form-control"
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      name="author"
                      placeholder="Author Name"
                      value={formData.author}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      type="file"
                      name="file"
                      onChange={handleChange}
                      required={!formData.fileURL}
                    />
                    {formData.fileName && (
                      <small className="text-muted">Uploaded: {formData.fileName}</small>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editIndex !== null ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="modal d-block fade show animate__animated animate__fadeIn" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
              </div>
              <div className="modal-body">Are you sure you want to delete this book?</div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteConfirmed}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
