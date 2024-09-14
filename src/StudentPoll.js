import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const StudentPoll = () => {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const studentName = localStorage.getItem("studentName"); // Retrieve name from localStorage

  useEffect(() => {
    const socket = io("http://localhost:8000"); // Replace with your backend URL

    if (!studentName) {
      navigate("/"); // Redirect to entry page if name is not available
    }

    socket.on("new_poll", (pollData) => {
      setPoll(pollData);
      setResults(null);
      setHasSubmitted(false);
    });

    socket.on("poll_results", (resultData) => {
      setResults(resultData);
    });

    return () => {
      socket.off("new_poll");
      socket.off("poll_results");
    };
  }, [navigate, studentName]);

  const submitAnswer = () => {
    if (poll && answer && !hasSubmitted) {
      const socket = io("http://localhost:8000"); // Replace with your backend URL
      socket.emit("submit_answer", { studentName, answer });
      setHasSubmitted(true);
    }
  };

  const getOptionPercentage = (option) => {
    if (!results || !results.results) return "0%";
    return results.results[option]?.percentage || "0%";
  };

  return (
    <div>
      <h1>Student Poll</h1>

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

      {results && (
        <div>
          <h3>Poll Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default StudentPoll;
