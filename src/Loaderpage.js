import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import io from socket.io-client

const LoaderPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:8000"); // Replace with your backend URL

    // Redirect to StudentPoll when a poll is available
    socket.on("create_poll", () => {
      navigate("/polling");
    });

    return () => {
      socket.off("create_poll");
    };
  }, [navigate]);

  return (
    <div className="loading-container">
      <h1>Wait for the teacher to ask questions...</h1>
    </div>
  );
};

export default LoaderPage;
