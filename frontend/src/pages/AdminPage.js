import React, { useContext } from "react";
import BooksAdmin from "../components/BooksAdmin";
import { ThemeContext } from "../context/ThemeContext";
import GenresAdmin from "../components/GenresAdmin";

const AdminPage = () => {
  const { theme } = useContext(ThemeContext);

  const containerStyles = {
    padding: "20px",
    backgroundColor: theme === "light" ? "#fafafa" : "#444",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
  };

  const headerStyles = {
    textAlign: "center",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyles}>
      <h1 style={headerStyles}>Admin Page</h1>
      <BooksAdmin />
      <GenresAdmin />
    </div>
  );
};

export default AdminPage;
