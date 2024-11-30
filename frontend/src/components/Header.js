import React, { Component } from "react";
import Navbar from "./Navbar";
import AuthLinks from "./AuthLinks";
/* использование классов */
/* использование state */
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "light",
    };
  }

  toggleTheme = () => {
    this.setState((prevState) => ({
      theme: prevState.theme === "light" ? "dark" : "light",
    }));
  };

  render() {
    const { theme } = this.state;
    return (
      <header className={theme}>
        <Navbar />
        <AuthLinks />
        <button onClick={this.toggleTheme}>Toggle Theme</button>
      </header>
    );
  }
}

export default Header;
