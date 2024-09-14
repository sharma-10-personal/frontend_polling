import React, { useState } from "react";
import io from "socket.io-client";
import "./TeacherPage.css"; // Import the CSS file for styling

// Connect to the backend Socket.IO server
const socket = io("http://localhost:8000"); // Replace with your backend URL

const TeacherPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]); // 4 options by default

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const createPoll = (e) => {
    e.preventDefault();

    if (question && options.every((option) => option)) {
      const pollData = {
        question,
        options,
      };

      socket.emit("create_poll", pollData);
      alert("Poll created successfully!");
      setQuestion("");
      setOptions(["", "", "", ""]); // Reset the form
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="teacher-container">
      <div className="card">
        <h1>Create a Poll (Teacher)</h1>
        <form onSubmit={createPoll}>
          <div className="form-group">
            <label>Poll Question:</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <h3>Options:</h3>
            {options.map((option, index) => (
              <div className="option-group" key={index}>
                <label>Option {index + 1}:</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <button type="submit">Create Poll</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherPage;
