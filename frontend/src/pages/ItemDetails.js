import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/books/${id}`)
      .then((response) => setItem(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <p>Author: {item.author}</p>
      <p>Price: ${item.price}</p>
      <p>Added: {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p>
      <p>
        Last Updated: {moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
      </p>
    </div>
  );
};

export default ItemDetails;
