const express = require("express");
const router = express.Router();
const ServiceType = require("../models/ServiceType");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Create service type
router.post("/", auth, admin, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newServiceType = new ServiceType({ name, description });
    const serviceType = await newServiceType.save();
    res.json(serviceType);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Read service types
router.get("/", async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find();
    res.json(serviceTypes);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Update service type
router.put("/:id", auth, admin, async (req, res) => {
  const { name, description } = req.body;
  try {
    let serviceType = await ServiceType.findById(req.params.id);
    if (!serviceType)
      return res.status(404).json({ msg: "Service type not found" });

    serviceType = await ServiceType.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description } },
      { new: true }
    );
    res.json(serviceType);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete service type
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);
    if (!serviceType)
      return res.status(404).json({ msg: "Service type not found" });

    await ServiceType.findByIdAndDelete(req.params.id);
    res.json({ msg: "Service type removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
