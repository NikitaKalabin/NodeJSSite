import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "../context/ThemeContext";

const Footer = ({ text }) => {
  const { theme } = useContext(ThemeContext);

  const footerStyles = {
    padding: "10px 20px",
    textAlign: "center",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    position: "relative",
    bottom: 0,
    width: "100%",
  };

  return (
    <footer style={footerStyles}>
      <p>{text}</p>
    </footer>
  );
};

Footer.propTypes = {
  text: PropTypes.string,
};

Footer.defaultProps = {
  text: `© ${new Date().getFullYear()} All rights reserved.`,
};

export default Footer;
