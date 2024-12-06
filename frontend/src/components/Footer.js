import React, { Component } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "../context/ThemeContext";

class Footer extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      footerText: props.text,
      originalText: props.text,
      isOriginal: true,
    };
  }

  handleChangeText = () => {
    this.setState((prevState) => ({
      footerText: prevState.isOriginal
        ? "Visit my GitHub: https://github.com/bober20"
        : prevState.originalText,
      isOriginal: !prevState.isOriginal,
    }));
  };

  render() {
    const { theme } = this.context;
    const { footerText } = this.state;

    const footerStyles = {
      padding: "10px 20px",
      textAlign: "center",
      backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
      color: theme === "light" ? "#000" : "#fff",
      position: "relative",
      bottom: 0,
      width: "100%",
    };

    const buttonStyles = {
      padding: "5px 10px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      backgroundColor:
        theme === "light" ? "rgb(0, 150, 136)" : "rgb(0, 128, 115)",
      color: "#fff",
      marginTop: "10px",
    };

    return (
      <footer style={footerStyles}>
        <p>{footerText}</p>
        <button style={buttonStyles} onClick={this.handleChangeText}>
          Change Text
        </button>
      </footer>
    );
  }
}

Footer.propTypes = {
  text: PropTypes.string,
};

Footer.defaultProps = {
  text: `© ${new Date().getFullYear()} All rights reserved.`,
};

export default Footer;
