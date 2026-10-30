import React from 'react';
import { calculateGrade, SUBJECTS } from '../data/sampleData';

const Dashboard = ({ students, setCurrentTab }) => {
  // 1. Total Students
  const totalStudents = students.length;

  // 2. Attendance Stats
  const totalClassesSum = students.reduce((sum, s) => sum + (s.attendance?.total || 0), 0);
  const totalAttendedSum = students.reduce((sum, s) => sum + (s.attendance?.attended || 0), 0);
  const overallAttendancePercent = totalClassesSum > 0 
    ? Math.round((totalAttendedSum / totalClassesSum) * 100) 
    : 0;

  // 3. Average Marks Stats
  const studentAcademicDetails = students.map((s) => {
    const marksArr = Object.values(s.marks || {});
    const totalMarks = marksArr.reduce((sum, m) => sum + Number(m || 0), 0);
    const maxMarks = SUBJECTS.length * 100;
    const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;
    const gradeInfo = calculateGrade(percentage);

    // Individual attendance %
    const attTotal = s.attendance?.total || 0;
    const attAttended = s.attendance?.attended || 0;
    const attPct = attTotal > 0 ? Math.round((attAttended / attTotal) * 100) : 0;

    return {
      ...s,
      totalMarks,
      percentage,
      gradeInfo,
      attendancePercent: attPct,
    };
  });

  const totalPercentageSum = studentAcademicDetails.reduce((sum, s) => sum + s.percentage, 0);
  const classAverageMarks = totalStudents > 0 
    ? Math.round(totalPercentageSum / totalStudents) 
    : 0;
  const overallGrade = calculateGrade(classAverageMarks);

  // Top performers sorted by marks
  const topPerformers = [...studentAcademicDetails]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  // Attendance breakdown
  const highAttendanceCount = studentAcademicDetails.filter((s) => s.attendancePercent >= 85).length;
  const avgAttendanceCount = studentAcademicDetails.filter((s) => s.attendancePercent >= 75 && s.attendancePercent < 85).length;
  const lowAttendanceCount = studentAcademicDetails.filter((s) => s.attendancePercent < 75).length;

  return (
    <div className="tab-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Academic & Student Dashboard</h2>
          <p className="page-subtitle">Overview of enrolled students, real-time attendance, and academic performance</p>
        </div>
        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setCurrentTab('attendance')}
          >
            Mark Attendance
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setCurrentTab('students')}
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        {/* Card 1: Total Students */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Students</span>
            <div className="stat-icon-wrapper primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-footer">
            <span className="stat-tag success">Active Roster</span>
            <span className="stat-caption">Enrolled this term</span>
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Overall Attendance</span>
            <div className="stat-icon-wrapper success">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-value">{overallAttendancePercent}%</div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill success" 
              style={{ width: `${Math.min(overallAttendancePercent, 100)}%` }}
            ></div>
          </div>
          <div className="stat-footer">
            <span className="stat-caption">
              {totalAttendedSum} of {totalClassesSum} sessions present
            </span>
          </div>
        </div>

        {/* Card 3: Class Average Marks */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Class Average Marks</span>
            <div className="stat-icon-wrapper info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
          </div>
          <div className="stat-value">{classAverageMarks}%</div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill info" 
              style={{ width: `${Math.min(classAverageMarks, 100)}%` }}
            ></div>
          </div>
          <div className="stat-footer">
            <span className={`badge ${overallGrade.color}`}>Grade {overallGrade.grade}</span>
            <span className="stat-caption">{overallGrade.label}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Performers & Attendance Breakdown */}
      <div className="dashboard-grid-2">
        {/* Top Performers */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Top Academic Performers</h3>
              <p className="card-subtitle">Highest scoring students across all subjects</p>
            </div>
            <button 
              type="button" 
              className="btn-link"
              onClick={() => setCurrentTab('academics')}
            >
              View All &rarr;
            </button>
          </div>

          <div className="card-body no-padding">
            {topPerformers.length === 0 ? (
              <div className="empty-state">No students added yet.</div>
            ) : (
              <div className="rank-list">
                {topPerformers.map((student, idx) => (
                  <div key={student.id} className="rank-item">
                    <div className="rank-badge">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="rank-info">
                      <div className="rank-name">{student.name}</div>
                      <div className="rank-sub">Roll No: #{student.rollNo} • {student.gradeClass}</div>
                    </div>
                    <div className="rank-score">
                      <span className="score-percentage">{student.percentage}%</span>
                      <span className={`badge ${student.gradeInfo.color}`}>
                        {student.gradeInfo.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Attendance Health</h3>
              <p className="card-subtitle">Student distribution by attendance rate</p>
            </div>
            <button 
              type="button" 
              className="btn-link"
              onClick={() => setCurrentTab('attendance')}
            >
              Manage &rarr;
            </button>
          </div>

          <div className="card-body">
            <div className="attendance-dist-list">
              <div className="dist-row">
                <div className="dist-label-group">
                  <span className="status-indicator-dot success"></span>
                  <span className="dist-label">Good Standing (85%+)</span>
                </div>
                <div className="dist-metrics">
                  <span className="dist-count">{highAttendanceCount} students</span>
                  <span className="dist-pct">
                    {totalStudents > 0 ? Math.round((highAttendanceCount / totalStudents) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill success" 
                  style={{ width: `${totalStudents > 0 ? (highAttendanceCount / totalStudents) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="dist-row" style={{ marginTop: '1.25rem' }}>
                <div className="dist-label-group">
                  <span className="status-indicator-dot warning"></span>
                  <span className="dist-label">Average (75% - 84%)</span>
                </div>
                <div className="dist-metrics">
                  <span className="dist-count">{avgAttendanceCount} students</span>
                  <span className="dist-pct">
                    {totalStudents > 0 ? Math.round((avgAttendanceCount / totalStudents) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill warning" 
                  style={{ width: `${totalStudents > 0 ? (avgAttendanceCount / totalStudents) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="dist-row" style={{ marginTop: '1.25rem' }}>
                <div className="dist-label-group">
                  <span className="status-indicator-dot danger"></span>
                  <span className="dist-label">Low / At Risk (&lt;75%)</span>
                </div>
                <div className="dist-metrics">
                  <span className="dist-count">{lowAttendanceCount} students</span>
                  <span className="dist-pct">
                    {totalStudents > 0 ? Math.round((lowAttendanceCount / totalStudents) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill danger" 
                  style={{ width: `${totalStudents > 0 ? (lowAttendanceCount / totalStudents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="quick-info-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Students with attendance below 75% require immediate counselor follow-up.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
