import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const ServiceTypesAdmin = ({ onServiceTypeAdded }) => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editServiceTypeId, setEditServiceTypeId] = useState(null);

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const response = await api.get("/api/serviceTypes");
      setServiceTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addServiceType = async (e) => {
    e.preventDefault();
    try {
      const newServiceType = { name, description };
      await api.post("/api/serviceTypes", newServiceType, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchServiceTypes();
      setName("");
      setDescription("");
      onServiceTypeAdded(); // Вызов функции обновления списка услуг
    } catch (error) {
      console.error(error);
    }
  };

  const deleteServiceType = async (id) => {
    try {
      await api.delete(`/api/serviceTypes/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchServiceTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditServiceType = (serviceType) => {
    setEditMode(true);
    setEditServiceTypeId(serviceType._id);
    setName(serviceType.name);
    setDescription(serviceType.description);
  };

  const editServiceType = async (e) => {
    e.preventDefault();
    try {
      const updatedServiceType = { name, description };
      await api.put(
        `/api/serviceTypes/${editServiceTypeId}`,
        updatedServiceType,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      fetchServiceTypes();
      setEditMode(false);
      setEditServiceTypeId(null);
      setName("");
      setDescription("");
      onServiceTypeAdded(); // Вызов функции обновления списка услуг
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    const localDate = new Date(date).toLocaleString();
    const utcDate = new Date(date).toUTCString();
    return `Local: ${localDate}, UTC: ${utcDate}`;
  };

  const containerStyles = {
    padding: "20px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
  };

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    backgroundColor: theme === "light" ? "#fff" : "#444",
    borderRadius: "10px",
    boxShadow:
      theme === "light"
        ? "0 0 15px rgba(0, 0, 0, 0.1)"
        : "0 0 15px rgba(255, 255, 255, 0.1)",
    maxWidth: "600px",
    margin: "0 auto 20px",
  };

  const inputStyles = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid",
    borderColor: theme === "light" ? "#ccc" : "#666",
    backgroundColor: theme === "light" ? "#fff" : "#555",
    color: theme === "light" ? "#000" : "#fff",
  };

  const buttonStyles = {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: theme === "light" ? "#009688" : "#0056b3",
    color: "#fff",
  };

  const listStyles = {
    listStyleType: "none",
    padding: 0,
    width: "100%",
    maxWidth: "600px",
  };

  const listItemStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#444",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      theme === "light"
        ? "0 0 15px rgba(0, 0, 0, 0.1)"
        : "0 0 15px rgba(255, 255, 255, 0.1)",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyles}>
      <h1>Service Types</h1>
      {user && user.isAdmin && (
        <form
          onSubmit={editMode ? editServiceType : addServiceType}
          style={formStyles}
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyles}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyles}
          />
          <button type="submit" style={buttonStyles}>
            {editMode ? "Update Service Type" : "Add Service Type"}
          </button>
          {editMode && (
            <button onClick={() => setEditMode(false)} style={buttonStyles}>
              Cancel
            </button>
          )}
        </form>
      )}
      <ul style={listStyles}>
        {serviceTypes.map((serviceType) => (
          <li key={serviceType._id} style={listItemStyles}>
            <h3>{serviceType.name}</h3>
            <p>{serviceType.description}</p>
            <p>Created At: {formatDate(serviceType.createdAt)}</p>
            <p>Updated At: {formatDate(serviceType.updatedAt)}</p>
            {user && user.isAdmin && (
              <>
                <button
                  onClick={() => startEditServiceType(serviceType)}
                  style={buttonStyles}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteServiceType(serviceType._id)}
                  style={buttonStyles}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceTypesAdmin;
