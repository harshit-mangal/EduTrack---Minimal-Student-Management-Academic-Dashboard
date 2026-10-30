export const initialStudents = [
  {
    id: 'STU-101',
    name: 'Aarav Sharma',
    rollNo: '101',
    gradeClass: 'Grade 10-A',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    attendance: {
      total: 45,
      attended: 42,
      history: {
        '2026-10-31': 'Present',
        '2026-10-30': 'Present',
        '2026-10-29': 'Present',
        '2026-10-28': 'Present',
        '2026-10-27': 'Absent',
      }
    },
    marks: {
      math: 92,
      science: 89,
      english: 85,
      history: 80,
      computer: 96,
    }
  },
  {
    id: 'STU-102',
    name: 'Ananya Patel',
    rollNo: '102',
    gradeClass: 'Grade 10-A',
    email: 'ananya.p@example.com',
    phone: '+91 98765 43211',
    attendance: {
      total: 45,
      attended: 44,
      history: {
        '2026-10-31': 'Present',
        '2026-10-30': 'Present',
        '2026-10-29': 'Present',
        '2026-10-28': 'Present',
        '2026-10-27': 'Present',
      }
    },
    marks: {
      math: 96,
      science: 95,
      english: 91,
      history: 88,
      computer: 98,
    }
  },
  {
    id: 'STU-103',
    name: 'Rohan Verma',
    rollNo: '103',
    gradeClass: 'Grade 10-B',
    email: 'rohan.v@example.com',
    phone: '+91 98765 43212',
    attendance: {
      total: 45,
      attended: 35,
      history: {
        '2026-10-31': 'Absent',
        '2026-10-30': 'Present',
        '2026-10-29': 'Absent',
        '2026-10-28': 'Present',
        '2026-10-27': 'Present',
      }
    },
    marks: {
      math: 68,
      science: 72,
      english: 65,
      history: 60,
      computer: 75,
    }
  },
  {
    id: 'STU-104',
    name: 'Diya Sen',
    rollNo: '104',
    gradeClass: 'Grade 10-A',
    email: 'diya.sen@example.com',
    phone: '+91 98765 43213',
    attendance: {
      total: 45,
      attended: 41,
      history: {
        '2026-10-31': 'Present',
        '2026-10-30': 'Present',
        '2026-10-29': 'Present',
        '2026-10-28': 'Absent',
        '2026-10-27': 'Present',
      }
    },
    marks: {
      math: 84,
      science: 88,
      english: 90,
      history: 82,
      computer: 92,
    }
  },
  {
    id: 'STU-105',
    name: 'Kabir Mehta',
    rollNo: '105',
    gradeClass: 'Grade 10-B',
    email: 'kabir.m@example.com',
    phone: '+91 98765 43214',
    attendance: {
      total: 45,
      attended: 31,
      history: {
        '2026-10-31': 'Absent',
        '2026-10-30': 'Absent',
        '2026-10-29': 'Present',
        '2026-10-28': 'Present',
        '2026-10-27': 'Absent',
      }
    },
    marks: {
      math: 55,
      science: 58,
      english: 62,
      history: 48,
      computer: 64,
    }
  },
  {
    id: 'STU-106',
    name: 'Sneha Kulkarni',
    rollNo: '106',
    gradeClass: 'Grade 10-A',
    email: 'sneha.k@example.com',
    phone: '+91 98765 43215',
    attendance: {
      total: 45,
      attended: 43,
      history: {
        '2026-10-31': 'Present',
        '2026-10-30': 'Present',
        '2026-10-29': 'Present',
        '2026-10-28': 'Present',
        '2026-10-27': 'Present',
      }
    },
    marks: {
      math: 78,
      science: 82,
      english: 86,
      history: 79,
      computer: 88,
    }
  }
];

export const SUBJECTS = [
  { key: 'math', label: 'Mathematics' },
  { key: 'science', label: 'Science' },
  { key: 'english', label: 'English' },
  { key: 'history', label: 'History' },
  { key: 'computer', label: 'Computer Science' },
];

export const calculateGrade = (percentage) => {
  if (percentage >= 90) return { grade: 'A+', label: 'Outstanding', color: 'badge-success' };
  if (percentage >= 80) return { grade: 'A', label: 'Excellent', color: 'badge-primary' };
  if (percentage >= 70) return { grade: 'B', label: 'Good', color: 'badge-info' };
  if (percentage >= 60) return { grade: 'C', label: 'Average', color: 'badge-warning' };
  if (percentage >= 50) return { grade: 'D', label: 'Pass', color: 'badge-secondary' };
  return { grade: 'F', label: 'Needs Improvement', color: 'badge-danger' };
};
