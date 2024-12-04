import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const GenresAdmin = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editGenreId, setEditGenreId] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await api.get("/api/genres");
      setGenres(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addGenre = async (e) => {
    e.preventDefault();
    try {
      const newGenre = { name, description };
      await api.post("/api/genres", newGenre, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchGenres();
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGenre = async (id) => {
    try {
      await api.delete(`/api/genres/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchGenres();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditGenre = (genre) => {
    setEditMode(true);
    setEditGenreId(genre._id);
    setName(genre.name);
    setDescription(genre.description);
  };

  const editGenre = async (e) => {
    e.preventDefault();
    try {
      const updatedGenre = { name, description };
      await api.put(`/api/genres/${editGenreId}`, updatedGenre, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchGenres();
      setEditMode(false);
      setEditGenreId(null);
      setName("");
      setDescription("");
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
  };

  const genreListStyles = {
    listStyleType: "none",
    padding: 0,
  };

  const genreItemStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#444",
    padding: "20px",
    borderRadius: "5px",
    boxShadow:
      theme === "light"
        ? "0 0 10px rgba(0, 0, 0, 0.1)"
        : "0 0 10px rgba(255, 255, 255, 0.1)",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyles}>
      <h1>Genres</h1>
      {user && user.isAdmin && (
        <form onSubmit={editMode ? editGenre : addGenre} style={formStyles}>
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
            {editMode ? "Update Genre" : "Add Genre"}
          </button>
          {editMode && (
            <button onClick={() => setEditMode(false)} style={buttonStyles}>
              Cancel
            </button>
          )}
        </form>
      )}
      <ul style={genreListStyles}>
        {genres.map((genre) => (
          <li key={genre._id} style={genreItemStyles}>
            <h3>{genre.name}</h3>
            <p>{genre.description}</p>
            <p>Created At: {formatDate(genre.createdAt)}</p>
            <p>Updated At: {formatDate(genre.updatedAt)}</p>
            {user && user.isAdmin && (
              <>
                <button
                  onClick={() => startEditGenre(genre)}
                  style={buttonStyles}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteGenre(genre._id)}
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

export default GenresAdmin;
