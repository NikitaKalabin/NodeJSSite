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
    backgroundColor: theme === "light" ? "#fafafa" : "#444",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
  };

  const dateStyles = {
    marginBottom: "20px",
  };

  const apiDataStyles = {
    marginTop: "20px",
  };

  const companyInfoStyles = {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: theme === "light" ? "#fff" : "#555",
    borderRadius: "10px",
    boxShadow:
      theme === "light"
        ? "0 0 10px rgba(0, 0, 0, 0.1)"
        : "0 0 10px rgba(255, 255, 255, 0.1)",
  };

  return (
    <div style={containerStyles}>
      <h1>Home Page</h1>
      <div style={dateStyles}>
        <p>Current Date: {currentDate}</p>
        <p>Time Zone: {timeZone}</p>
      </div>
      <div style={companyInfoStyles}>
        <h2>About Our Cleaning Company</h2>
        <p>
          Welcome to our professional cleaning company! We offer a wide range of
          cleaning services to meet your needs. Our team of experienced and
          dedicated cleaners is committed to providing high-quality service and
          ensuring customer satisfaction. Whether you need residential or
          commercial cleaning, we have the expertise to get the job done right.
        </p>
        <p>
          Our services include regular cleaning, deep cleaning, carpet cleaning,
          window cleaning, and more. We use eco-friendly cleaning products to
          ensure a safe and healthy environment for you and your family.
        </p>
        <p>
          Contact us today to schedule a cleaning service and experience the
          difference with our professional cleaning company!
        </p>
      </div>
      <div style={apiDataStyles}>{user && <ApiData />}</div>
    </div>
  );
};

export default Home;
