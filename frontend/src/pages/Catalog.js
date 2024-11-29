import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Catalog = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/api/books")
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Catalog</h1>
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
