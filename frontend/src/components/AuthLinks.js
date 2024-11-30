import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthLinks = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <>
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
};

export default AuthLinks;
