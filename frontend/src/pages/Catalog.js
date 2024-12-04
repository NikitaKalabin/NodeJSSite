import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import config from "../config";
import { ThemeContext } from "../context/ThemeContext";

const Catalog = () => {
  const { theme } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    fetchItems();
  }, [search, sortBy, order, genre]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchItems = () => {
    api
      .get("/api/books", {
        params: { search, sortBy, order, genre },
      })
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  };

  const fetchGenres = () => {
    api
      .get("/api/genres")
      .then((response) => setGenres(response.data))
      .catch((error) => console.error(error));
  };

  const containerStyles = {
    padding: "20px",
    backgroundColor: theme === "light" ? "#fafafa" : "#444",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
  };

  const filterStyles = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  };

  const selectStyles = {
    padding: "10px",
    borderRadius: "5px",
    border: `1px solid ${theme === "light" ? "#ccc" : "#666"}`,
    backgroundColor: theme === "light" ? "#fff" : "#555",
    color: theme === "light" ? "#000" : "#fff",
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  };

  const cardStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#444",
    padding: "20px",
    borderRadius: "5px",
    boxShadow:
      theme === "light"
        ? "0 0 10px rgba(0, 0, 0, 0.1)"
        : "0 0 10px rgba(255, 255, 255, 0.1)",
    textAlign: "center",
  };

  const imageStyles = {
    width: "100%",
    objectFit: "contain",
    borderRadius: "5px",
    marginBottom: "10px",
  };

  const buttonStyles = {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: theme === "light" ? "#007bff" : "#0056b3",
    color: "#fff",
    textDecoration: "none",
  };

  return (
    <div style={containerStyles}>
      <h1>Catalog</h1>
      <div style={filterStyles}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={selectStyles}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyles}
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={selectStyles}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={selectStyles}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
      <div style={gridStyles}>
        {items.map((item) => (
          <div key={item._id} style={cardStyles}>
            {item.image && (
              <img
                src={`${config.baseURL}${item.image}`}
                alt={item.title}
                style={imageStyles}
              />
            )}
            <h2>{item.title}</h2>
            <Link
              to={`/item/${item._id}`}
              state={{ item }}
              style={buttonStyles}
            >
              More Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
