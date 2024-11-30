import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import moment from "moment";

const ItemDetails = () => {
  const location = useLocation();
  const { item } = location.state || {};

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

ItemDetails.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.string,
    price: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

ItemDetails.defaultProps = {
  item: {
    title: "Unknown Title",
    description: "No description available",
    author: "Unknown Author",
    price: 0,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
};

export default ItemDetails;
