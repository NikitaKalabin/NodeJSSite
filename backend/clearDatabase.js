const mongoose = require("mongoose");
const User = require("./models/User");
const service = require("./models/service");
const serviceType = require("./models/serviceType");
const Review = require("./models/Review");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await service.deleteMany({});
    await serviceType.deleteMany({});
    await Review.deleteMany({});
    console.log("All collections have been cleared.");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error clearing collections:", err);
    mongoose.connection.close();
  }
};

clearDatabase();
