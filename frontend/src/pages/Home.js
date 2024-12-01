import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import ApiData from "../components/ApiData";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [currentDate, setCurrentDate] = useState("");
  const [timeZone, setTimeZone] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const date = new Date();
      setCurrentDate(date.toLocaleString());
      setTimeZone(
        new Intl.DateTimeFormat("en-US", {
          timeZoneName: "short",
        }).format(date)
      );
    };

    updateDate();
    const intervalId = setInterval(updateDate, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const containerStyles = {
    padding: "20px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
  };

  const dateStyles = {
    marginBottom: "20px",
  };

  const apiDataStyles = {
    marginTop: "20px",
  };

  return (
    <div style={containerStyles}>
      <h1>Home Page</h1>
      <div style={dateStyles}>
        <p>Current Date: {currentDate}</p>
        <p>Time Zone: {timeZone}</p>
      </div>
      <div style={apiDataStyles}>
        <ApiData />
      </div>
    </div>
  );
};

export default Home;
