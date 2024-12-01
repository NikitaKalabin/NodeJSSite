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
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

/* Декларативная функция */
function App() {
  const appStyles = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const mainStyles = {
    flex: 1,
    marginTop: "60px",
    display: "flex",
    justifyContent: "center",
  };

  const contentStyles = {
    width: "100%",
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div style={appStyles}>
            <Header />
            <main style={mainStyles}>
              <div style={contentStyles}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/item/:id" element={<ItemDetails />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute element={<AdminPage />} adminOnly />
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </div>
            </main>
            <Footer
              text={`© ${new Date().getFullYear()} Created by Nikita Kalabin. All rights reserved.`}
            />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
