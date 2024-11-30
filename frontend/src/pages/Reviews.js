import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchBooks();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get("/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get("/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = { book, rating, comment };
      await api.post("/api/reviews", newReview, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchReviews();
      setBook("");
      setRating(1);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async (id) => {
    try {
      await api.delete(`/api/reviews/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditReview = (review) => {
    setEditMode(true);
    setEditReviewId(review._id);
    setBook(review.book._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const editReview = async (e) => {
    e.preventDefault();
    try {
      const updatedReview = { rating, comment };
      await api.put(`/api/reviews/${editReviewId}`, updatedReview, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchReviews();
      setEditMode(false);
      setEditReviewId(null);
      setBook("");
      setRating(1);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Reviews</h1>
      {user && (
        <form onSubmit={editMode ? editReview : addReview}>
          <select
            value={book}
            onChange={(e) => setBook(e.target.value)}
            required
            disabled={editMode}
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
          <textarea
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">
            {editMode ? "Update Review" : "Add Review"}
          </button>
          {editMode && (
            <button onClick={() => setEditMode(false)}>Cancel</button>
          )}
        </form>
      )}
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <h3>{review.book.title}</h3>
            <p>Rating: {review.rating}</p>
            <p>{review.comment}</p>
            <p>By: {review.user.username}</p>
            {user && (user.isAdmin || user._id === review.user._id) && (
              <>
                <button onClick={() => startEditReview(review)}>Edit</button>
                <button onClick={() => deleteReview(review._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
