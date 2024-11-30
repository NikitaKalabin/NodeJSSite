import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Catalog = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    fetchItems();
  }, [search, sortBy, order, genre]);

  const fetchItems = () => {
    api
      .get("/api/books", {
        params: { search, sortBy, order, genre },
      })
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Catalog</h1>
      <div>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {/* Add options for genres dynamically */}
        </select>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <Link to={`/item/${item._id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;
