import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./StudentPage.css";

// Connect to the backend Socket.IO server
const socket = io("http://localhost:8000"); // Replace with your backend URL

const StudentPage = () => {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState("");
  const [studentName, setStudentName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isJoined, setIsJoined] = useState(false);
  const [pollClosed, setPollClosed] = useState(false); // Track if the poll is closed
  const [pollError, setPollError] = useState("");

  const intervalRef = useRef(null);

  useEffect(() => {
    socket.on("new_poll", (pollData) => {
      if (isJoined) {
        setPoll(pollData);
        setResults(null);
        setHasSubmitted(false);
        setPollClosed(false); // Reset pollClosed status

        setTimer(pollData.timerDuration || 60);

        intervalRef.current = setInterval(() => {
          setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
      }
    });

    socket.on("poll_results", (resultData) => {
      setResults(resultData);
    });

    socket.on("poll_closed", () => {
      setPollClosed(true); // Set pollClosed status when poll is closed
      clearInterval(intervalRef.current); // Stop the timer
    });

    return () => {
      socket.off("new_poll");
      socket.off("poll_results");
      socket.off("poll_closed");
      clearInterval(intervalRef.current);
    };
  }, [isJoined]);

  const submitAnswer = () => {
    if (!poll) {
      setPollError("No active poll available.");
      return;
    }

    if (answer && !hasSubmitted && !pollClosed) {
      socket.emit("submit_answer", answer);
      setHasSubmitted(true);
      clearInterval(intervalRef.current);
    }
  };

  const joinAsStudent = () => {
    if (studentName) {
      socket.emit("join_student", studentName);
      alert(`Joined as ${studentName}`);
      setStudentName("");
      setIsJoined(true);
      setPoll(null);
      setResults(null);
      setHasSubmitted(false);
      setPollError("");
    }
  };

  const getOptionPercentage = (option) => {
    if (!results || !results.results) return "0%";
    return results.results[option]?.percentage || "0%";
  };

  return (
    <div className="student-page">
      <h1>Student Poll</h1>

      {!isJoined && (
        <div className="student-page__join-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <button onClick={joinAsStudent}>Join as Student</button>
        </div>
      )}

      {isJoined && (
        <>
          {poll ? (
            <div className="student-page__poll">
              <h2>{poll.question}</h2>
              <div className="student-page__options">
                {poll.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !hasSubmitted && setAnswer(option)}
                    disabled={hasSubmitted || timer === 0 || pollClosed}
                    className={`option-button2 ${
                      answer === option ? "selected" : ""
                    }`}
                  >
                    {option} {results ? `(${getOptionPercentage(option)})` : ""}
                  </button>
                ))}
              </div>
              <button
                onClick={submitAnswer}
                disabled={hasSubmitted || timer === 0 || pollClosed}
              >
                Submit Answer
              </button>
              <div className="timer">Time remaining: {timer}s</div>
            </div>
          ) : (
            <h3>Wait for teacher to ask questions ...</h3>
          )}
        </>
      )}

      {pollError && <div className="error-message">{pollError}</div>}

      {results && <div className="student-page__results"></div>}
    </div>
  );
};

export default StudentPage;
