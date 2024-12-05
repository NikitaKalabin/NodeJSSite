import React, { useContext, useRef } from "react";
import ServicesAdmin from "../components/ServicesAdmin";
import ServiceTypesAdmin from "../components/ServicesTypesAdmin";
import { ThemeContext } from "../context/ThemeContext";

const AdminPage = () => {
  const { theme } = useContext(ThemeContext);
  const servicesAdminRef = useRef(null);

  const containerStyles = {
    padding: "20px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const headerStyles = {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2rem",
  };

  const sectionStyles = {
    width: "100%",
    maxWidth: "1200px",
    marginBottom: "40px",
    padding: "20px",
    backgroundColor: theme === "light" ? "#fff" : "#444",
    borderRadius: "10px",
    boxShadow:
      theme === "light"
        ? "0 0 15px rgba(0, 0, 0, 0.1)"
        : "0 0 15px rgba(255, 255, 255, 0.1)",
  };

  const sectionHeaderStyles = {
    marginBottom: "20px",
    fontSize: "1.5rem",
    borderBottom: `2px solid ${theme === "light" ? "#ccc" : "#666"}`,
    paddingBottom: "10px",
  };

  const handleServiceTypeAdded = () => {
    if (servicesAdminRef.current) {
      servicesAdminRef.current.fetchServiceTypes();
    }
  };

  return (
    <div style={containerStyles}>
      <h1 style={headerStyles}>Admin Page</h1>
      <div style={sectionStyles}>
        <h2 style={sectionHeaderStyles}>Manage Services</h2>
        <ServicesAdmin ref={servicesAdminRef} />
      </div>
      <div style={sectionStyles}>
        <h2 style={sectionHeaderStyles}>Manage Service Types</h2>
        <ServiceTypesAdmin onServiceTypeAdded={handleServiceTypeAdded} />
      </div>
    </div>
  );
};

export default AdminPage;
