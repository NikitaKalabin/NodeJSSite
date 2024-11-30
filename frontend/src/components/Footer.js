import React from "react";
import PropTypes from "prop-types";

const Footer = ({ text }) => {
  return (
    <footer>
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
