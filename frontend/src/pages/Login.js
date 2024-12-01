import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required("Username or Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.identifier, values.password);
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:7300/api/users/google";
  };

  const containerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
  };

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    backgroundColor: theme === "light" ? "#fff" : "#444",
    color: theme === "light" ? "#000" : "#fff",
    borderRadius: "5px",
    boxShadow:
      theme === "light"
        ? "0 0 10px rgba(0, 0, 0, 0.1)"
        : "0 0 10px rgba(255, 255, 255, 0.1)",
    maxWidth: "400px",
    width: "100%",
  };

  const inputStyles = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid",
    borderColor: theme === "light" ? "#ccc" : "#666",
    backgroundColor: theme === "light" ? "#fff" : "#555",
    color: theme === "light" ? "#000" : "#fff",
  };

  const buttonStyles = {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: theme === "light" ? "#007bff" : "#0056b3",
    color: "#fff",
  };

  return (
    <div style={containerStyles}>
      <form onSubmit={formik.handleSubmit} style={formStyles}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username or Email"
          {...formik.getFieldProps("identifier")}
          style={inputStyles}
        />
        {formik.touched.identifier && formik.errors.identifier ? (
          <div>{formik.errors.identifier}</div>
        ) : null}
        <input
          type="password"
          placeholder="Password"
          {...formik.getFieldProps("password")}
          style={inputStyles}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
        <button type="submit" style={buttonStyles}>
          Login
        </button>
        <button onClick={handleGoogleLogin} style={buttonStyles}>
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
