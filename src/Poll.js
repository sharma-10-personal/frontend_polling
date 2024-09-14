import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the backend Socket.IO server
const socket = io("http://localhost:8000"); // Replace with your backend URL

const Poll = () => {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    // Listen for new polls
    socket.on("new_poll", (pollData) => {
      console.log("New poll received:", pollData);
      setPoll(pollData);
      setResults(null); // Reset results for new poll
    });

    // Listen for poll results
    socket.on("poll_results", (resultData) => {
      console.log("Poll results received:", resultData);
      setResults(resultData);
    });

    // Listen for poll closed event
    socket.on("poll_closed", (message) => {
      console.log(message);
      alert("Poll is closed. You can view the results.");
    });

    // Cleanup the socket on component unmount
    return () => {
      socket.off("new_poll");
      socket.off("poll_results");
      socket.off("poll_closed");
    };
  }, []);

  // Function to submit answer as a student
  const submitAnswer = () => {
    if (poll && answer) {
      socket.emit("submit_answer", answer);
    }
  };

  // Function to join as a student
  const joinAsStudent = () => {
    if (studentName) {
      socket.emit("join_student", studentName);
      alert(`Joined as ${studentName}`);
    }
  };

  // Function to create a poll as a teacher
  const createPoll = () => {
    const pollData = {
      question: "What's your favorite color?",
      options: ["Red", "Blue", "Green", "Yellow"],
    };
    socket.emit("create_poll", pollData);
    alert("Poll created successfully!");
  };

  return (
    <div>
      <h1>Live Polling System</h1>

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

      {/* Button for teacher to create a poll */}
      <div>
        <button onClick={createPoll}>Create Poll (Teacher)</button>
      </div>

      {/* Display the poll if there's an active one */}
      {poll ? (
        <div>
          <h2>{poll.question}</h2>
          <div>
            {poll.options.map((option, index) => (
              <button key={index} onClick={() => setAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
          <button onClick={submitAnswer}>Submit Answer</button>
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

export default Poll;
