import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeacherPage from "./TeacherPage";
import StudentPage from "./StudentPage";
import Navigation from "../src/components/Navigation"; // Import Navigation from a separate file

import "./App.css"; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Welcome to Live Polling System</h1>
          <Navigation /> {/* Use the Navigation component here */}
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/student" element={<StudentPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 Live Polling System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
