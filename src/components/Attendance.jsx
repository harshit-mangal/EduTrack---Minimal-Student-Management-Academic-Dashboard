import React, { useState } from 'react';

const Attendance = ({ students, onUpdateAttendance }) => {
  // Default to today's ISO date string: YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Filter or search state within attendance if needed
  const [searchQuery, setSearchQuery] = useState('');

  // Daily summary stats for the selected date
  const totalStudents = students.length;
  let presentToday = 0;
  let absentToday = 0;
  let unmarkedToday = 0;

  students.forEach((s) => {
    const status = s.attendance?.history?.[selectedDate];
    if (status === 'Present') presentToday++;
    else if (status === 'Absent') absentToday++;
    else unmarkedToday++;
  });

  // Handle single student toggle
  const handleMark = (studentId, statusToSet) => {
    onUpdateAttendance(studentId, selectedDate, statusToSet);
  };

  // Bulk mark all
  const handleMarkAll = (status) => {
    students.forEach((s) => {
      onUpdateAttendance(s.id, selectedDate, status);
    });
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
  });

  return (
    <div className="tab-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Attendance Tracking</h2>
          <p className="page-subtitle">Mark daily attendance and automatically track student attendance rates</p>
        </div>

        {/* Date Selector & Quick Bulk Actions */}
        <div className="attendance-header-controls">
          <div className="date-picker-wrapper">
            <label htmlFor="attDate">Date:</label>
            <input
              id="attDate"
              type="date"
              className="input-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button 
            type="button" 
            className="btn btn-outline-success"
            onClick={() => handleMarkAll('Present')}
          >
            Mark All Present
          </button>
          <button 
            type="button" 
            className="btn btn-outline-danger"
            onClick={() => handleMarkAll('Absent')}
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Daily Summary Banner */}
      <div className="attendance-summary-cards">
        <div className="att-sum-card">
          <span className="att-sum-label">Selected Date</span>
          <span className="att-sum-value highlight">{selectedDate}</span>
        </div>
        <div className="att-sum-card">
          <span className="att-sum-label">Present Today</span>
          <span className="att-sum-value text-success">{presentToday}</span>
        </div>
        <div className="att-sum-card">
          <span className="att-sum-label">Absent Today</span>
          <span className="att-sum-value text-danger">{absentToday}</span>
        </div>
        <div className="att-sum-card">
          <span className="att-sum-label">Unmarked</span>
          <span className="att-sum-value text-muted">{unmarkedToday}</span>
        </div>
        <div className="att-sum-card">
          <span className="att-sum-label">Daily Turnout</span>
          <span className="att-sum-value text-primary">
            {totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0}%
          </span>
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
            placeholder="Search students in attendance list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Class</th>
                <th className="text-center">Today's Status</th>
                <th className="text-center">Attendance %</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="empty-state">No matching students found</div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const currentStatus = student.attendance?.history?.[selectedDate];
                  const total = student.attendance?.total || 0;
                  const attended = student.attendance?.attended || 0;
                  const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
                  const isSafe = pct >= 75;

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
                      <td className="text-center">
                        <div className="btn-toggle-group">
                          <button
                            type="button"
                            className={`btn-toggle present ${currentStatus === 'Present' ? 'active' : ''}`}
                            onClick={() => handleMark(student.id, 'Present')}
                          >
                            ✓ Present
                          </button>
                          <button
                            type="button"
                            className={`btn-toggle absent ${currentStatus === 'Absent' ? 'active' : ''}`}
                            onClick={() => handleMark(student.id, 'Absent')}
                          >
                            ✕ Absent
                          </button>
                        </div>
                      </td>
                      <td className="text-center">
                        <strong className="text-base">{pct}%</strong>
                        <div className="subtle-text">{attended} / {total} days</div>
                      </td>
                      <td style={{ minWidth: '130px' }}>
                        <div className="progress-bar-bg">
                          <div 
                            className={`progress-bar-fill ${isSafe ? 'success' : 'danger'}`} 
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td>
                        {isSafe ? (
                          <span className="badge badge-success">Good</span>
                        ) : (
                          <span className="badge badge-danger">Shortage</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
