import React from "react";
import Navbar from "./Navbar";
import AuthLinks from "./AuthLinks";

const Header = () => {
  return (
    <header>
      <Navbar />
      <AuthLinks />
    </header>
  );
};

export default Header;
