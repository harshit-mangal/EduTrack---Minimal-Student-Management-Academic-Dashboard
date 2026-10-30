# EduTrack - Minimal Student Management & Academic Dashboard

A clean, modern, and responsive Student Management and Academic Dashboard built using **React + Vite**, pure **CSS**, and **LocalStorage**.

---

## 🚀 Features

1. **Dashboard**
   - Live metrics: Total Students, Overall Attendance %, and Class Average Marks %.
   - Top academic performers ranking.
   - Attendance health distribution (Good Standing, Average, At Risk).

2. **Students Management**
   - Add new students with full details (Name, Roll No, Class, Email, Phone).
   - View student directory with avatars and summary badges.
   - Search students in real-time by Name, Roll No, or Class.
   - Delete student records with confirmation.

3. **Attendance Tracking**
   - Date selector to mark attendance for any day.
   - Toggle **Present** / **Absent** buttons with active state highlights.
   - Bulk actions: **Mark All Present** and **Mark All Absent**.
   - Automatic attendance percentage calculation with progress bars.

4. **Academics & Grades**
   - Record and update marks across 5 subjects (Mathematics, Science, English, History, Computer Science).
   - Real-time calculation of total marks (out of 500), percentage, and letter grades (`A+`, `A`, `B`, `C`, `D`, `F`).
   - Class summary: Average score, highest scorer, and overall passing rate.

5. **Data Persistence**
   - All changes persist automatically in browser **LocalStorage**.
   - Pre-loaded with realistic sample data.
   - One-click **Reset Sample Data** option in the sidebar.

---

## 🛠️ Tech Stack

- **React 18** (Functional components, `useState`, `useEffect`, `useMemo`)
- **Vite** (Ultra-fast build tool and dev server)
- **Vanilla CSS** (Custom CSS variables, modern flex/grid layouts, responsive breakpoints)
- **HTML5 LocalStorage** (Client-side persistence, no backend required)

---

## 💻 Setup & Run Instructions

```bash
# 1. Install dependencies (already installed if cloning locally)
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production
npm run build
```
