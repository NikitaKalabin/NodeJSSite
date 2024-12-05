import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import moment from "moment";
import { ThemeContext } from "../context/ThemeContext";
import api from "../utils/api";
import config from "../config";

const ItemDetails = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const { item } = location.state || {};
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/api/reviews", {
          params: { service: item._id },
        });
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [item._id]);

  if (!item) return <div>Loading...</div>;

  const containerStyles = {
    padding: "20px",
    backgroundColor: theme === "light" ? "#fafafa" : "#444",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
  };

  const itemStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const imageStyles = {
    width: "300px",
    height: "400px",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "20px",
  };

  const linkStyles = {
    textDecoration: "none",
    color: theme === "light" ? "#000" : "#fff",
  };

  const reviewListStyles = {
    marginTop: "40px",
  };

  const reviewItemStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#444",
    padding: "20px",
    borderRadius: "5px",
    boxShadow:
      theme === "light"
        ? "0 0 10px rgba(0, 0, 0, 0.1)"
        : "0 0 10px rgba(255, 255, 255, 0.1)",
    marginBottom: "10px",
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

  return (
    <div style={containerStyles}>
      <div style={itemStyles}>
        {item.image && (
          <img
            src={`${config.baseURL}${item.image}`}
            alt={item.title}
            style={imageStyles}
          />
        )}
        <h1>Name of service: {item.title}</h1>
        <p>Price: ${item.price}</p>
        <p>Description: {item.description}</p>
      </div>
      <div style={reviewListStyles}>
        <h2>Reviews</h2>
        {reviews.map((review) => (
          <div key={review._id} style={reviewItemStyles}>
            <h3>{review.user.username}</h3>
            <div>{renderStars(review.rating)}</div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ItemDetails.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    image: PropTypes.string,
  }),
};

ItemDetails.defaultProps = {
  item: {
    title: "Unknown Name",
    description: "No description available",
    price: 0,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    image: "",
  },
};

export default ItemDetails;
