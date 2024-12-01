import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import config from "../config";

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [reviews, setReviews] = useState([]);
  const [services, setservices] = useState([]);
  const [selectedserviceForReview, setSelectedserviceForReview] = useState("");
  const [selectedserviceForFilter, setSelectedserviceForFilter] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, []);

  const fetchReviews = async (selectedservice = "") => {
    try {
      const response = await api.get("/api/reviews", {
        params: { service: selectedservice },
      });
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get("/api/services");
      setservices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = { service: selectedserviceForReview, rating, comment };
      await api.post("/api/reviews", newReview, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchReviews();
      setSelectedserviceForReview("");
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
      fetchReviews(selectedserviceForFilter);
    } catch (error) {
      console.error(error);
    }
  };

  const startEditReview = (review) => {
    setEditMode(true);
    setEditReviewId(review._id);
    setSelectedserviceForReview(review.service._id);
    setRating(review.rating);
    setComment(review.comment);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const editReview = async (e) => {
    e.preventDefault();
    try {
      const updatedReview = { rating, comment };
      await api.put(`/api/reviews/${editReviewId}`, updatedReview, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchReviews(selectedserviceForFilter);
      setEditMode(false);
      setEditReviewId(null);
      setSelectedserviceForReview("");
      setRating(1);
      setComment("");
    } catch (error) {
      console.error(error);
    }
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
    marginBottom: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const selectStyles = {
    padding: "10px",
    borderRadius: "5px",
    border: `1px solid ${theme === "light" ? "#ccc" : "#666"}`,
    backgroundColor: theme === "light" ? "#fff" : "#555",
    color: theme === "light" ? "#000" : "#fff",
  };

  const reviewListStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const reviewCardStyles = {
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

  const progressBarStyles = (rating) => ({
    width: `${rating * 20}%`,
    height: "10px",
    backgroundColor: rating >= 4 ? "green" : rating >= 2 ? "orange" : "red",
    borderRadius: "5px",
  });

  const linkStyles = {
    textDecoration: "none",
    color: theme === "light" ? "#007bff" : "#66b2ff",
  };

  const buttonStyles = {
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: theme === "light" ? "#007bff" : "#0056b3",
    color: "#fff",
    marginRight: "10px",
  };

  return (
    <div style={containerStyles}>
      <h1>Reviews</h1>
      {user && (
        <form
          onSubmit={editMode ? editReview : addReview}
          style={formStyles}
          ref={formRef}
        >
          <select
            value={selectedserviceForReview}
            onChange={(e) => setSelectedserviceForReview(e.target.value)}
            required
            disabled={editMode}
            style={selectStyles}
          >
            <option value="">Select service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.title}
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
            style={selectStyles}
          />
          <textarea
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={selectStyles}
          />
          <button type="submit" style={buttonStyles}>
            {editMode ? "Update Review" : "Add Review"}
          </button>
          {editMode && (
            <button onClick={() => setEditMode(false)} style={buttonStyles}>
              Cancel
            </button>
          )}
        </form>
      )}
      <select
        value={selectedserviceForFilter}
        onChange={(e) => {
          setSelectedserviceForFilter(e.target.value);
          fetchReviews(e.target.value);
        }}
        style={selectStyles}
      >
        <option value="">All services</option>
        {services.map((service) => (
          <option key={service._id} value={service._id}>
            {service.title}
          </option>
        ))}
      </select>
      <div style={reviewListStyles}>
        {reviews.map((review) => (
          <div key={review._id} style={reviewCardStyles}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {review.service.image && (
                <img
                  src={`${config.baseURL}${review.service.image}`}
                  alt={review.service.title}
                  style={imageStyles}
                />
              )}
              <div>
                <Link
                  to={`/item/${review.service._id}`}
                  state={{ item: review.service }}
                  style={linkStyles}
                >
                  <h3>{review.service.title}</h3>
                </Link>
                <div style={progressBarStyles(review.rating)}></div>
                <p>Rating: {review.rating}</p>
                <p>{review.comment}</p>
                <p>By: {review.user.username}</p>
                {user && (user.isAdmin || user._id === review.user._id) && (
                  <>
                    <button
                      onClick={() => startEditReview(review)}
                      style={buttonStyles}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
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

export default Reviews;
