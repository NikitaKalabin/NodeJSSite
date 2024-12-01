import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navStyles = {
    ul: {
      listStyle: "none",
      display: "flex",
      gap: "10px",
    },
    li: {
      display: "inline",
    },
    a: {
      textDecoration: "none",
      color: "inherit",
    },
  };

  return (
    <nav>
      <ul style={navStyles.ul}>
        <li style={navStyles.li}>
          <Link to="/" style={navStyles.a}>
            Home
          </Link>
        </li>
        <li style={navStyles.li}>
          <Link to="/catalog" style={navStyles.a}>
            Catalog
          </Link>
        </li>
        <li style={navStyles.li}>
          <Link to="/reviews" style={navStyles.a}>
            Reviews
          </Link>
        </li>
        <li style={navStyles.li}>
          <Link to="/admin" style={navStyles.a}>
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
