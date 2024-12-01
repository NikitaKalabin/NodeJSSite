import React, { useContext } from "react";
import ServicesAdmin from "../components/ServicesAdmin";
import { ThemeContext } from "../context/ThemeContext";
import ServicesTypesAdmin from "../components/ServicesTypesAdmin";
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
      <ServicesAdmin />
      <ServicesTypesAdmin />
    </div>
  );
};

export default AdminPage;
