import React, { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import AuthLinks from "./AuthLinks";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [catImage, setCatImage] = useState(null);

  useEffect(() => {
    const fetchCatImage = async () => {
      try {
        const response = await axios.get(
          "https://api.thecatapi.com/v1/images/search"
        );
        setCatImage(response.data[0].url);
      } catch (error) {
        console.error("Error fetching cat image:", error);
      }
    };

    fetchCatImage();
  }, []);

  const headerStyles = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "20px 20px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
  };

  const catImageStyles = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "20px",
  };

  return (
    <header style={headerStyles}>
      {catImage && <img src={catImage} alt="Cat" style={catImageStyles} />}
      <Navbar />
      <AuthLinks />
    </header>
  );
};

export default Header;
