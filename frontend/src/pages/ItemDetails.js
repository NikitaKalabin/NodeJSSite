import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import moment from "moment";
import Slider from "react-slick";
import { ThemeContext } from "../context/ThemeContext";
import api from "../utils/api";
import config from "../config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ItemDetails = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const { item } = location.state || {};
  const [randomservices, setRandomServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/api/services");
        const services = response.data.filter(
          (service) => service._id !== item._id
        );
        const shuffled = services.sort(() => 0.5 - Math.random());
        setRandomServices(shuffled.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
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

  const sliderStyles = {
    marginTop: "40px",
  };

  const sliderItemStyles = {
    padding: "10px",
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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
        <h1>{item.title}</h1>
        <p>${item.price}</p>
        <p>Author: {item.author}</p>
        <p>{item.description}</p>
      </div>
      <div style={sliderStyles}>
        <h2>You will also like</h2>
        <Slider {...sliderSettings}>
          {randomservices.map((service) => (
            <div key={service._id} style={sliderItemStyles}>
              <Link
                to={`/item/${service._id}`}
                state={{ item: service }}
                style={linkStyles}
              >
                {service.image && (
                  <img
                    src={`${config.baseURL}${service.image}`}
                    alt={service.title}
                    style={imageStyles}
                  />
                )}
                <h3>{service.title}</h3>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
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
    image: PropTypes.string,
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
    image: "",
  },
};

export default ItemDetails;
