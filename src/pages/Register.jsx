import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'animate.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [department, setDepartment] = useState('')
  const navigate = useNavigate()

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const usersByRole = JSON.parse(localStorage.getItem('usersByRole')) || {
      admin: [],
      librarian: [],
      student: [],
      guest: []
    }

    const isDuplicate = usersByRole.student.some((u) => u.email === email)
    if (isDuplicate) {
      alert('Email already registered!')
      return
    }

    const newUser = {
      id: crypto.randomUUID(),
      username: name,
      email,
      password,
      department,
      role: 'student'
    }

    usersByRole.student.push(newUser)
    localStorage.setItem('usersByRole', JSON.stringify(usersByRole))
    alert('Registration successful!')
    navigate('/')
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center text-white"
      style={{
        backgroundImage: 'url(https://as1.ftcdn.net/v2/jpg/02/92/60/86/1000_F_292608623_FVzbEvQLqAdYZIL4yOXkzRYVS1191ls6.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', zIndex: 0 }} />

      <div className="container position-relative z-1 animate__animated animate__fadeIn">
        <div className="row justify-content-center text-center mb-5">
          <h1 className="display-5 fw-bold">eLibrary Management System</h1>
          <p className="lead text-light">Create your account to access the system.</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card bg-dark text-white p-4 shadow animate__animated animate__zoomIn">
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleRegister() }}>
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="Name"
                  pattern="^[a-zA-Z ]{3,}$"
                  title="Name should be at least 3 letters and contain only alphabets or spaces"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="form-control mb-3"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="form-control mb-3"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                  title="Password must contain at least 6 characters, one uppercase, one lowercase, and one digit"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  className="form-control mb-3"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <select
                  className="form-select mb-3"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="IT">Information Technology</option>
                </select>
                <button type="submit" className="btn btn-success w-100">Sign Up</button>
              </form>
              <p className="mt-3 text-center">
                Already have an account? <a href="/" className="text-info">Sign In</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
