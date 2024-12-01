import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ThemeContext } from "../context/ThemeContext";

const Register = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      isAdmin: false,
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await api.post("/api/users/register", values);
        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    },
  });

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
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Username"
          {...formik.getFieldProps("username")}
          style={inputStyles}
        />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : null}
        <input
          type="email"
          placeholder="Email"
          {...formik.getFieldProps("email")}
          style={inputStyles}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
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
        <label>
          <input type="checkbox" {...formik.getFieldProps("isAdmin")} />
          Admin
        </label>
        <button type="submit" style={buttonStyles}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
