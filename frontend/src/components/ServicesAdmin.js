import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import config from "../config";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const ServicesAdmin = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/api/services");
      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await api.get("/api/serviceTypes");
      setServiceTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("serviceType", serviceType);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/api/services", formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      fetchServices();
      setTitle("");
      setDescription("");
      setPrice("");
      setServiceType("");
      setImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/api/services/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchServices();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditService = (service) => {
    setEditMode(true);
    setEditServiceId(service._id);
    setTitle(service.title);
    setDescription(service.description);
    setPrice(service.price);
    setServiceType(service.serviceType);
    setImage(null); // Reset image field
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("serviceType", serviceType);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.put(`/api/services/${editServiceId}`, formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      fetchServices();
      setEditMode(false);
      setEditServiceId(null);
      setTitle("");
      setDescription("");
      setPrice("");
      setServiceType("");
      setImage(null);
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
    backgroundColor: theme === "light" ? "#fafafa" : "#444",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
  };

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    backgroundColor: theme === "light" ? "#fff" : "#444",
    borderRadius: "5px",
    boxShadow:
      theme === "light"
        ? "0 0 10px rgba(0, 0, 0, 0.1)"
        : "0 0 10px rgba(255, 255, 255, 0.1)",
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
    backgroundColor: theme === "light" ? "#007bff" : "#0056b3",
    color: "#fff",
    marginLeft: "10px",
  };

  const serviceListStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const serviceCardStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#444",
    padding: "20px",
    borderRadius: "5px",
    boxShadow:
      theme === "light"
        ? "0 0 10px rgba(0, 0, 0, 0.1)"
        : "0 0 10px rgba(255, 255, 255, 0.1)",
  };

  const imageStyles = {
    width: "100px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "5px",
    marginRight: "20px",
  };

  const linkStyles = {
    textDecoration: "none",
    color: theme === "light" ? "#007bff" : "#66b2ff",
  };

  return (
    <div style={containerStyles}>
      <h1>Services</h1>
      {user && user.isAdmin && (
        <form
          onSubmit={editMode ? editService : addService}
          style={formStyles}
          ref={formRef}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyles}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyles}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyles}
          />
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            style={inputStyles}
          >
            <option value="">Select serviceType</option>
            {serviceTypes.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" style={buttonStyles}>
            {editMode ? "Update service" : "Add service"}
          </button>
          {editMode && (
            <button onClick={() => setEditMode(false)} style={buttonStyles}>
              Cancel
            </button>
          )}
        </form>
      )}
      <div style={serviceListStyles}>
        {services.map((service) => (
          <div key={service._id} style={serviceCardStyles}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {service.image && (
                <img
                  src={`${config.baseURL}${service.image}`}
                  alt={service.title}
                  style={imageStyles}
                />
              )}
              <div>
                <Link
                  to={`/item/${service._id}`}
                  state={{ item: service }}
                  style={linkStyles}
                >
                  <h3>{service.title}</h3>
                </Link>
                <p>Created At: {formatDate(service.createdAt)}</p>
                <p>Updated At: {formatDate(service.updatedAt)}</p>
                {user && user.isAdmin && (
                  <>
                    <button
                      onClick={() => startEditService(service)}
                      style={buttonStyles}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(service._id)}
                      style={buttonStyles}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesAdmin;
