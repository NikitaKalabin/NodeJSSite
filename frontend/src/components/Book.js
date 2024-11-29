import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("api/books");
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async () => {
    try {
      const newBook = { title, author, description, price };
      await api.post("/api/books", newBook);
      fetchBooks();
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.delete(`/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Books</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <Link to={`/item/${book._id}`}>{book.title}</Link>
            <button onClick={() => deleteBook(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
