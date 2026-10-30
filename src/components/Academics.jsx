import React, { useState } from 'react';
import { calculateGrade, SUBJECTS } from '../data/sampleData';

const Academics = ({ students, onUpdateMarks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editMarksData, setEditMarksData] = useState({});

  // Open edit modal
  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setEditMarksData({
      math: student.marks?.math ?? 0,
      science: student.marks?.science ?? 0,
      english: student.marks?.english ?? 0,
      history: student.marks?.history ?? 0,
      computer: student.marks?.computer ?? 0,
    });
  };

  const handleScoreChange = (subjectKey, value) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    setEditMarksData((prev) => ({
      ...prev,
      [subjectKey]: num,
    }));
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateMarks(editingStudent.id, editMarksData);
    setEditingStudent(null);
  };

  // Preview calculations for the edit modal
  const editTotal = Object.values(editMarksData).reduce((sum, v) => sum + Number(v || 0), 0);
  const editMax = SUBJECTS.length * 100;
  const editPercentage = editMax > 0 ? Math.round((editTotal / editMax) * 100) : 0;
  const editGrade = calculateGrade(editPercentage);

  // Overall statistics for summary cards
  const studentStats = students.map((s) => {
    const marksArr = Object.values(s.marks || {});
    const total = marksArr.reduce((sum, m) => sum + Number(m || 0), 0);
    const max = SUBJECTS.length * 100;
    const pct = max > 0 ? Math.round((total / max) * 100) : 0;
    return {
      ...s,
      total,
      percentage: pct,
      gradeInfo: calculateGrade(pct),
    };
  });

  const totalStudents = students.length;
  const highestStudent = [...studentStats].sort((a, b) => b.percentage - a.percentage)[0];
  const totalPctSum = studentStats.reduce((sum, s) => sum + s.percentage, 0);
  const avgClassPct = totalStudents > 0 ? Math.round(totalPctSum / totalStudents) : 0;
  const passedStudents = studentStats.filter((s) => s.percentage >= 50).length;
  const passingRate = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0;

  const filteredStudents = studentStats.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
  });

  return (
    <div className="tab-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Academic Records & Grades</h2>
          <p className="page-subtitle">Enter subject marks and automatically compute totals, percentages, and letter grades</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Class Average Score</span>
            <div className="stat-icon-wrapper info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
          </div>
          <div className="stat-value">{avgClassPct}%</div>
          <div className="stat-footer">
            <span className="stat-caption">Across all 5 core subjects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Highest Score</span>
            <div className="stat-icon-wrapper success">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-value">
            {highestStudent ? `${highestStudent.percentage}%` : 'N/A'}
          </div>
          <div className="stat-footer">
            <span className="stat-caption">
              {highestStudent ? `${highestStudent.name} (#${highestStudent.rollNo})` : 'No records'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Passing Rate (50%+)</span>
            <div className="stat-icon-wrapper primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-value">{passingRate}%</div>
          <div className="stat-footer">
            <span className="stat-caption">{passedStudents} of {totalStudents} passing</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="table-controls">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search students to view or update marks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Marks Table */}
      <div className="card table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                {SUBJECTS.map((sub) => (
                  <th key={sub.key} className="text-center">{sub.label}</th>
                ))}
                <th className="text-center">Total (500)</th>
                <th className="text-center">Percentage</th>
                <th className="text-center">Grade</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6 + SUBJECTS.length} className="text-center py-8">
                    <div className="empty-state">No matching students found</div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="student-name">{student.name}</div>
                          <div className="student-email">{student.gradeClass}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-subtle">#{student.rollNo}</span>
                    </td>
                    {SUBJECTS.map((sub) => {
                      const val = student.marks?.[sub.key] ?? 0;
                      return (
                        <td key={sub.key} className="text-center">
                          <span className={`subject-mark ${val < 50 ? 'failing' : ''}`}>
                            {val}
                          </span>
                        </td>
                      );
                    })}
                    <td className="text-center font-bold">
                      {student.total}
                    </td>
                    <td className="text-center">
                      <span className="score-pct-text">{student.percentage}%</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${student.gradeInfo.color}`}>
                        {student.gradeInfo.grade}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => handleOpenEdit(student)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        Edit Marks
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Marks Modal */}
      {editingStudent && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Edit Marks: {editingStudent.name}</h3>
                <p className="card-subtitle">Roll No #{editingStudent.rollNo} • {editingStudent.gradeClass}</p>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setEditingStudent(null)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveMarks}>
              <div className="modal-body">
                <div className="marks-grid">
                  {SUBJECTS.map((sub) => (
                    <div className="form-group" key={sub.key}>
                      <label htmlFor={`sub-${sub.key}`}>{sub.label} (Max 100)</label>
                      <input
                        id={`sub-${sub.key}`}
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={editMarksData[sub.key] ?? 0}
                        onChange={(e) => handleScoreChange(sub.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {/* Real-time Calculation Summary Box */}
                <div className="calculation-preview-box">
                  <div className="calc-item">
                    <span className="calc-label">Total Marks</span>
                    <span className="calc-value">{editTotal} / {editMax}</span>
                  </div>
                  <div className="calc-item">
                    <span className="calc-label">Percentage</span>
                    <span className="calc-value text-primary">{editPercentage}%</span>
                  </div>
                  <div className="calc-item">
                    <span className="calc-label">Calculated Grade</span>
                    <span className={`badge ${editGrade.color}`}>{editGrade.grade} ({editGrade.label})</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;
