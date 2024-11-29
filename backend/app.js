require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const app = express();

// Connect to MongoDB
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
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/books", require("./routes/books"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/genres", require("./routes/genres"));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
