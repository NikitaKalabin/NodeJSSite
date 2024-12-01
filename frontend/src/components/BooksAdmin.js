import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import config from "../config";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const BooksAdmin = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const formRef = useRef(null);

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

  const addBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("genre", genre);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/api/books", formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      fetchBooks();
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
      setGenre("");
      setImage(null);
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
    setImage(null); // Reset image field
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("genre", genre);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.put(`/api/books/${editBookId}`, formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      fetchBooks();
      setEditMode(false);
      setEditBookId(null);
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
      setGenre("");
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
  };

  const bookListStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const bookCardStyles = {
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
      <h1>Books</h1>
      {user && user.isAdmin && (
        <form
          onSubmit={editMode ? editBook : addBook}
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
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={inputStyles}
          >
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" style={buttonStyles}>
            {editMode ? "Update Book" : "Add Book"}
          </button>
          {editMode && (
            <button onClick={() => setEditMode(false)} style={buttonStyles}>
              Cancel
            </button>
          )}
        </form>
      )}
      <div style={bookListStyles}>
        {books.map((book) => (
          <div key={book._id} style={bookCardStyles}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {book.image && (
                <img
                  src={`${config.baseURL}${book.image}`}
                  alt={book.title}
                  style={imageStyles}
                />
              )}
              <div>
                <Link
                  to={`/item/${book._id}`}
                  state={{ item: book }}
                  style={linkStyles}
                >
                  <h3>{book.title}</h3>
                </Link>
                <p>Created At: {formatDate(book.createdAt)}</p>
                <p>Updated At: {formatDate(book.updatedAt)}</p>
                {user && user.isAdmin && (
                  <>
                    <button
                      onClick={() => startEditBook(book)}
                      style={buttonStyles}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book._id)}
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

export default BooksAdmin;
