import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import config from "../config";

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServiceForReview, setSelectedServiceForReview] =
    useState(null);
  const [selectedServiceForFilter, setSelectedServiceForFilter] =
    useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, []);

  const fetchReviews = async (selectedService = "") => {
    try {
      const response = await api.get("/api/reviews", {
        params: { service: selectedService },
      });
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get("/api/services");
      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        service: selectedServiceForReview.value,
        rating,
        comment,
      };
      await api.post("/api/reviews", newReview, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchReviews();
      setSelectedServiceForReview(null);
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
      fetchReviews(
        selectedServiceForFilter ? selectedServiceForFilter.value : ""
      );
    } catch (error) {
      console.error(error);
    }
  };

  const startEditReview = (review) => {
    setEditMode(true);
    setEditReviewId(review._id);
    setSelectedServiceForReview({
      value: review.service._id,
      label: review.service.title,
    });
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
      fetchReviews(
        selectedServiceForFilter ? selectedServiceForFilter.value : ""
      );
      setEditMode(false);
      setEditReviewId(null);
      setSelectedServiceForReview(null);
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
    control: (base) => ({
      ...base,
      backgroundColor: theme === "light" ? "#fff" : "#555",
      borderColor: theme === "light" ? "#ccc" : "#666",
      color: theme === "light" ? "#000" : "#fff",
      marginTop: "30px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "light" ? "#fff" : "#555",
      color: theme === "light" ? "#000" : "#fff",
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === "light" ? "#000" : "#fff",
    }),
    placeholder: (base) => ({
      ...base,
      color: theme === "light" ? "#000" : "#fff",
    }),
  };

  const reviewListStyles = {
    marginTop: "20px",
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

  const starStyles = {
    display: "inline-block",
    color: "#ffd700",
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={starStyles}>
          {i <= rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  const linkStyles = {
    textDecoration: "none",
    color: theme === "light" ? "#009688" : "#008073",
  };

  const buttonStyles = {
    padding: "10px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: theme === "light" ? "#009688" : "#008073",
    color: "#fff",
  };

  const serviceOptions = services.map((service) => ({
    value: service._id,
    label: service.title,
  }));

  return (
    <div style={containerStyles}>
      <h1>Reviews</h1>
      {user && (
        <form
          onSubmit={editMode ? editReview : addReview}
          style={formStyles}
          ref={formRef}
        >
          <Select
            value={selectedServiceForReview}
            onChange={setSelectedServiceForReview}
            options={serviceOptions}
            isDisabled={editMode}
            placeholder="Select service"
            styles={selectStyles}
            isSearchable
          />
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: `1px solid ${theme === "light" ? "#ccc" : "#666"}`,
              backgroundColor: theme === "light" ? "#fff" : "#555",
              color: theme === "light" ? "#000" : "#fff",
            }}
          />
          <textarea
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: `1px solid ${theme === "light" ? "#ccc" : "#666"}`,
              backgroundColor: theme === "light" ? "#fff" : "#555",
              color: theme === "light" ? "#000" : "#fff",
            }}
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
      <Select
        value={selectedServiceForFilter}
        onChange={(option) => {
          setSelectedServiceForFilter(option);
          fetchReviews(option ? option.value : "");
        }}
        options={serviceOptions}
        placeholder="All services"
        styles={selectStyles}
        isSearchable
      />
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
                <div>{renderStars(review.rating)}</div>
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
