import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const AuthLinks = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const authLinksStyles = {
    display: "flex",
    gap: "10px",
    flexBasis: "14%",
    span: {
      marginRight: "10px",
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
  };

  return (
    <div style={authLinksStyles}>
      {user ? (
        <>
          <span style={authLinksStyles.span}>{user.username}</span>
          <button style={authLinksStyles.button} onClick={logout}>
            Logout
          </button>
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
