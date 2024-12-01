import React, { Component } from "react";
import Navbar from "./Navbar";
import AuthLinks from "./AuthLinks";
import { ThemeContext } from "../context/ThemeContext";

class Header extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      theme: "light",
    };
  }

  componentDidMount() {
    const { theme } = this.context;
    this.setState({ theme });
  }

  toggleTheme = () => {
    const { toggleTheme } = this.context;
    this.setState(
      (prevState) => ({
        theme: prevState.theme === "light" ? "dark" : "light",
      }),
      () => {
        toggleTheme();
      }
    );
  };

  render() {
    const { theme } = this.state;

    const headerStyles = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
      color: theme === "light" ? "#000" : "#fff",
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 1000,
    };

    const buttonStyles = {
      padding: "5px 10px",
      border: "none",
      cursor: "pointer",
      backgroundColor: theme === "light" ? "#fff" : "#444",
      color: theme === "light" ? "#000" : "#fff",
    };

    return (
      <header style={headerStyles}>
        <Navbar />
        <button style={buttonStyles} onClick={this.toggleTheme}>
          Toggle Theme
        </button>
        <AuthLinks />
      </header>
    );
  }
}

export default Header;
