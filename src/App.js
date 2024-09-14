import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import TeacherPage from "./TeacherPage";
import StudentPage from "./StudentPage";

import "./App.css"; // Import the CSS file

const Navigation = () => {
  const location = useLocation();
  const shouldShowNav = location.pathname === "/";

  return shouldShowNav ? (
    <nav>
      <ul>
        <li>
          <Link to="/teacher">I'm a teacher</Link>
        </li>
        <li>
          <Link to="/student">I'm a Student</Link>
        </li>
      </ul>
    </nav>
  ) : null;
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Welcome to Live polling system</h1>
          <h3>
            Please select the role that best describes you to begin using the
            live polling system
          </h3>
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
