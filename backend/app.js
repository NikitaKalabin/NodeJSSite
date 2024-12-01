require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const app = express();

// Подключение к базе данных MongoDB
connectDB();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Инициализация passport
app.use(passport.initialize());
app.use(passport.session());

// Обслуживание статических файлов из директории uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Подключение маршрутов
app.use("/api/users", require("./routes/users"));
app.use("/api/services", require("./routes/services"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/serviceTypes", require("./routes/serviceTypes"));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
