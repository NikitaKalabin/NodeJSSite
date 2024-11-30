import React from "react";
import BooksAdmin from "../components/BooksAdmin";
import GenresAdmin from "../components/GenresAdmin";
import ReviewsAdmin from "../components/ReviewsAdmin";
import UsersAdmin from "../components/UsersAdmin";
const AdminPage = () => {
  return (
    <div>
      <h1>Admin Page</h1>
      <BooksAdmin />
    </div>
  );
};

export default AdminPage;
