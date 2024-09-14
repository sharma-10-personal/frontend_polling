import React, { useState } from "react";
import io from "socket.io-client";
import "./TeacherPage.css"; // Import the CSS file for styling

// Connect to the backend Socket.IO server
const socket = io("http://localhost:8000"); // Replace with your backend URL

const TeacherPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]); // 4 options by default
  const [timerDuration, setTimerDuration] = useState(60); // Default timer duration is 60 seconds

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
        timerDuration, // Send timer duration along with poll data
      };

      socket.emit("create_poll", pollData);
      alert("Poll created successfully!");
      setQuestion("");
      setOptions(["", "", "", ""]); // Reset the form
      setTimerDuration(60); // Reset the timer to default
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

          <div className="form-group">
            <label>Timer Duration (in seconds):</label>
            <select
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value))}
              required
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
          </div>

          <button type="submit">Create Poll</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherPage;
