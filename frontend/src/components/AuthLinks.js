import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const AuthLinks = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const authLinksStyles = {
    display: "flex",
    gap: "10px",
    position: "relative",
    span: {
      marginRight: "10px",
      cursor: "pointer",
    },
    button: {
      padding: "5px 10px",
      border: "none",
      cursor: "pointer",
      backgroundColor: theme === "light" ? "#000" : "#fff",
      color: theme === "light" ? "#fff" : "#000",
    },
    link: {
      textDecoration: "none",
      color: theme === "light" ? "#000" : "#fff",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      right: 0,
      backgroundColor: theme === "light" ? "#fff" : "#444",
      color: theme === "light" ? "#000" : "#fff",
      border: `1px solid ${theme === "light" ? "#ccc" : "#666"}`,
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      display: dropdownVisible ? "block" : "none",
      zIndex: 1000,
    },
    dropdownItem: {
      padding: "10px",
      cursor: "pointer",
    },
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div style={authLinksStyles}>
      {user ? (
        <>
          <span style={authLinksStyles.span} onClick={toggleDropdown}>
            {user.username}
          </span>
          <div style={authLinksStyles.dropdown}>
            <Link to="/settings" style={authLinksStyles.link}>
              <div style={authLinksStyles.dropdownItem}>Settings</div>
            </Link>
            <div style={authLinksStyles.dropdownItem} onClick={logout}>
              Logout
            </div>
          </div>
        </>
      ) : (
        <>
          <Link to="/login" style={authLinksStyles.link}>
            Login
          </Link>
          <Link to="/register" style={authLinksStyles.link}>
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthLinks;
