const mongoose = require("mongoose");
const debug = require("debug")("app:db");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    debug("MongoDB connected.");
  } catch (err) {
    debug("Error connecting to MongoDB: %O", err);
    process.exit(1);
  }
};

module.exports = connectDB;
