import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const BooksAdmin = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get("/api/genres");
      setGenres(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async () => {
    try {
      const newBook = { title, author, description, price, genre };
      await api.post("/api/books", newBook, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchBooks();
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
      setGenre("");
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
    setGenre(book.genre);
  };

  const editBook = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = { title, author, description, price, genre };
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
      setGenre("");
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
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
          <button type="submit">{editMode ? "Update Book" : "Add Book"}</button>
          {editMode && (
            <button onClick={() => setEditMode(false)}>Cancel</button>
          )}
        </form>
      )}
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <Link to={`/item/${book._id}`} state={{ item: book }}>
              {book.title}
            </Link>
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
