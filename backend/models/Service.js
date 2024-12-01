const mongoose = require("mongoose");
const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  serviceType: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceType" },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Service", ServiceSchema);
