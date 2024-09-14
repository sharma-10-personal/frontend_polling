import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the backend Socket.IO server
const socket = io("http://localhost:8000"); // Replace with your backend URL

const StudentPage = () => {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState("");
  const [studentName, setStudentName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track if the student has submitted an answer

  useEffect(() => {
    // Listen for new polls
    socket.on("new_poll", (pollData) => {
      setPoll(pollData);
      setResults(null); // Reset results for new poll
      setHasSubmitted(false); // Reset submission status for new poll
    });

    // Listen for poll results
    socket.on("poll_results", (resultData) => {
      setResults(resultData);
    });

    return () => {
      socket.off("new_poll");
      socket.off("poll_results");
    };
  }, []);

  const submitAnswer = () => {
    if (poll && answer && !hasSubmitted) {
      socket.emit("submit_answer", answer);
      setHasSubmitted(true); // Mark as submitted
    }
  };

  const joinAsStudent = () => {
    if (studentName) {
      socket.emit("join_student", studentName);
      alert(`Joined as ${studentName}`);
    }
  };

  // Function to get percentage for each option from results
  const getOptionPercentage = (option) => {
    if (!results || !results.results) return "0%";
    return results.results[option]?.percentage || "0%";
  };

  return (
    <div>
      <h1>Student Poll</h1>

      {/* Input for joining as a student */}
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <button onClick={joinAsStudent}>Join as Student</button>
      </div>

      {/* Display the poll if there's an active one */}
      {poll ? (
        <div>
          <h2>{poll.question}</h2>
          <div>
            {poll.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !hasSubmitted && setAnswer(option)}
                disabled={hasSubmitted}
              >
                {option} {results ? `(${getOptionPercentage(option)})` : ""}
              </button>
            ))}
          </div>
          <button onClick={submitAnswer} disabled={hasSubmitted}>
            Submit Answer
          </button>
        </div>
      ) : (
        <h3>No active poll.</h3>
      )}

      {/* Display the poll results if available */}
      {results && (
        <div>
          <h3>Poll Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
