import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState("");
  const [timeZone, setTimeZone] = useState("");

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleString());
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <p>Current Date: {currentDate}</p>
        <p>Time Zone: {timeZone}</p>
      </div>
    </div>
  );
};

export default Home;
