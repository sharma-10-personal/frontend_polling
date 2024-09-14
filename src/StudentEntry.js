import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentEntry = () => {
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (studentName) {
      localStorage.setItem("studentName", studentName); // Store name in localStorage
      navigate("/loading"); // Redirect to loading page
    }
  };

  return (
    <div className="entry-container">
      <h1>Join as Student</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <button onClick={handleJoin}>Join as Student</button>
    </div>
  );
};

export default StudentEntry;
