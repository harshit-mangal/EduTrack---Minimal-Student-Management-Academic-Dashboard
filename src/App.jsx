import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Attendance from './components/Attendance';
import Academics from './components/Academics';
import { initialStudents } from './data/sampleData';
import './App.css';

const STORAGE_KEY = 'edutrack_students_data_v1';

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse students from localStorage:', e);
    }
    return initialStudents;
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync to LocalStorage whenever students state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [students]);

  // Handler: Add Student
  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  // Handler: Delete Student
  const handleDeleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // Handler: Update Attendance for a date
  const handleUpdateAttendance = (studentId, dateStr, newStatus) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const currentHistory = student.attendance?.history || {};
        const oldStatus = currentHistory[dateStr];

        if (oldStatus === newStatus) return student; // No change

        let total = student.attendance?.total || 0;
        let attended = student.attendance?.attended || 0;

        if (oldStatus) {
          // Date was already recorded, changing status
          if (oldStatus === 'Present' && newStatus === 'Absent') {
            attended = Math.max(0, attended - 1);
          } else if (oldStatus === 'Absent' && newStatus === 'Present') {
            attended = attended + 1;
          }
        } else {
          // First time marking for this date
          total = total + 1;
          if (newStatus === 'Present') {
            attended = attended + 1;
          }
        }

        return {
          ...student,
          attendance: {
            total,
            attended,
            history: {
              ...currentHistory,
              [dateStr]: newStatus,
            },
          },
        };
      })
    );
  };

  // Handler: Update Marks
  const handleUpdateMarks = (studentId, updatedMarks) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        return {
          ...student,
          marks: {
            ...student.marks,
            ...updatedMarks,
          },
        };
      })
    );
  };

  // Handler: Reset default sample data
  const handleResetData = () => {
    if (window.confirm('Reset all data to the initial sample students? Your current changes will be overwritten.')) {
      setStudents(initialStudents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        studentCount={students.length}
        onResetData={handleResetData}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-viewport">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="top-navbar-left">
            <button
              type="button"
              className="btn-hamburger"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="current-view-badge">
              <span className="dot"></span>
              <span className="tab-name">{currentTab.toUpperCase()}</span>
            </div>
          </div>

          <div className="top-navbar-right">
            <span className="date-indicator">
              📅 {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="admin-chip">
              <span className="admin-avatar">AD</span>
              <span className="admin-name">Admin Portal</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <main className="content-body">
          {currentTab === 'dashboard' && (
            <Dashboard 
              students={students} 
              setCurrentTab={setCurrentTab} 
            />
          )}

          {currentTab === 'students' && (
            <Students
              students={students}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {currentTab === 'attendance' && (
            <Attendance
              students={students}
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}

          {currentTab === 'academics' && (
            <Academics
              students={students}
              onUpdateMarks={handleUpdateMarks}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
