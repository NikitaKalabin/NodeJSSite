import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ItemDetails from "./pages/ItemDetails";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reviews from "./pages/Reviews";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

/* Декларативная функция */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route
                path="/admin"
                element={<ProtectedRoute element={<AdminPage />} adminOnly />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          {/* Example of props */}
          <Footer
            text={`© ${new Date().getFullYear()} Created by Nikita Kalabin. All rights reserved.`}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
