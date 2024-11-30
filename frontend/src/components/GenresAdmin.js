import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const GenresAdmin = () => {
  const { user } = useContext(AuthContext);
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

  return (
    <div>
      <h1>Genres</h1>
      {user && user.isAdmin && (
        <form onSubmit={editMode ? editGenre : addGenre}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">
            {editMode ? "Update Genre" : "Add Genre"}
          </button>
          {editMode && (
            <button onClick={() => setEditMode(false)}>Cancel</button>
          )}
        </form>
      )}
      <ul>
        {genres.map((genre) => (
          <li key={genre._id}>
            <h3>{genre.name}</h3>
            <p>{genre.description}</p>
            <p>Created At: {formatDate(genre.createdAt)}</p>
            <p>Updated At: {formatDate(genre.updatedAt)}</p>
            {user && user.isAdmin && (
              <>
                <button onClick={() => startEditGenre(genre)}>Edit</button>
                <button onClick={() => deleteGenre(genre._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenresAdmin;
