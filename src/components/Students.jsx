import React, { useState, useMemo } from 'react';
import { calculateGrade, SUBJECTS } from '../data/sampleData';

const Students = ({ students, onAddStudent, onDeleteStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    gradeClass: 'Grade 10-A',
    email: '',
    phone: '',
  });

  const [formError, setFormError] = useState('');

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return students;
    return students.filter((s) => 
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.gradeClass.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  }, [students, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Student name is required');
      return;
    }
    if (!formData.rollNo.trim()) {
      setFormError('Roll number is required');
      return;
    }

    // Check if roll number already exists
    const rollExists = students.some(
      (s) => s.rollNo.toLowerCase() === formData.rollNo.trim().toLowerCase()
    );
    if (rollExists) {
      setFormError(`A student with Roll No #${formData.rollNo} already exists`);
      return;
    }

    // Construct new student record
    const newStudent = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      rollNo: formData.rollNo.trim(),
      gradeClass: formData.gradeClass.trim() || 'Grade 10-A',
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: formData.phone.trim() || '+91 98000 00000',
      attendance: {
        total: 10,
        attended: 10,
        history: {},
      },
      marks: {
        math: 75,
        science: 75,
        english: 75,
        history: 75,
        computer: 75,
      },
    };

    onAddStudent(newStudent);
    // Reset form
    setFormData({
      name: '',
      rollNo: '',
      gradeClass: 'Grade 10-A',
      email: '',
      phone: '',
    });
    setFormError('');
    setShowAddModal(false);
  };

  return (
    <div className="tab-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Students Directory</h2>
          <p className="page-subtitle">Manage, enroll, search, and review all active students</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => {
            setFormError('');
            setShowAddModal(true);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Student
        </button>
      </div>

      {/* Control Bar: Search and Count */}
      <div className="table-controls">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by name, roll no, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="btn-clear" 
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="results-count">
          Showing <strong>{filteredStudents.length}</strong> of {students.length} students
        </div>
      </div>

      {/* Students Table */}
      <div className="card table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Contact</th>
                <th>Attendance</th>
                <th>Avg. Marks</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="empty-state">
                      <p className="empty-title">No students found</p>
                      <p className="empty-subtitle">
                        {searchQuery ? 'Try matching a different keyword' : 'Click "Add New Student" to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const attTotal = student.attendance?.total || 0;
                  const attAttended = student.attendance?.attended || 0;
                  const attPct = attTotal > 0 ? Math.round((attAttended / attTotal) * 100) : 0;

                  const marksArr = Object.values(student.marks || {});
                  const totalMarks = marksArr.reduce((sum, m) => sum + Number(m || 0), 0);
                  const maxMarks = SUBJECTS.length * 100;
                  const marksPct = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;
                  const grade = calculateGrade(marksPct);

                  return (
                    <tr key={student.id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="student-name">{student.name}</div>
                            <div className="student-email">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-subtle">#{student.rollNo}</span>
                      </td>
                      <td>{student.gradeClass}</td>
                      <td>
                        <span className="phone-text">{student.phone || '—'}</span>
                      </td>
                      <td>
                        <div className="table-attendance">
                          <span className={`status-badge ${attPct >= 75 ? 'present' : 'absent'}`}>
                            {attPct}%
                          </span>
                          <span className="subtle-text">({attAttended}/{attTotal})</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-marks">
                          <strong>{marksPct}%</strong>
                          <span className={`badge ${grade.color}`}>{grade.grade}</span>
                        </div>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          title={`Delete ${student.name}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Add New Student</h3>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="alert-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="req">*</span></label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Priya Nair"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="rollNo">Roll Number <span className="req">*</span></label>
                    <input
                      id="rollNo"
                      name="rollNo"
                      type="text"
                      required
                      placeholder="e.g. 107"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gradeClass">Class / Grade</label>
                    <select
                      id="gradeClass"
                      name="gradeClass"
                      value={formData.gradeClass}
                      onChange={handleInputChange}
                    >
                      <option value="Grade 10-A">Grade 10-A</option>
                      <option value="Grade 10-B">Grade 10-B</option>
                      <option value="Grade 11-A">Grade 11-A</option>
                      <option value="Grade 11-B">Grade 11-B</option>
                      <option value="Grade 12-A">Grade 12-A</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. priya@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. +91 98765 00000"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
