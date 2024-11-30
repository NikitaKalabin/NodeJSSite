import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const BooksAdmin = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async () => {
    try {
      const newBook = { title, author, description, price };
      await api.post("/api/books", newBook, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
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
      await api.delete(`/api/books/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditBook = (book) => {
    setEditMode(true);
    setEditBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setPrice(book.price);
  };

  const editBook = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = { title, author, description, price };
      await api.put(`/api/books/${editBookId}`, updatedBook, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchBooks();
      setEditMode(false);
      setEditBookId(null);
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
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
      <h1>Books</h1>
      {user && user.isAdmin && (
        <form onSubmit={editMode ? editBook : addBook}>
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
          <button type="submit">{editMode ? "Update Book" : "Add Book"}</button>
          {editMode && (
            <button onClick={() => setEditMode(false)}>Cancel</button>
          )}
        </form>
      )}
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <Link to={`/item/${book._id}`}>{book.title}</Link>
            <p>Created At: {formatDate(book.createdAt)}</p>
            <p>Updated At: {formatDate(book.updatedAt)}</p>
            {user && user.isAdmin && (
              <>
                <button onClick={() => startEditBook(book)}>Edit</button>
                <button onClick={() => deleteBook(book._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksAdmin;
