const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Review = require("../models/Review");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../config/multerConfig");

// Create service
router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  const { title, description, price, serviceType } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const newService = new Service({
      title,
      description,
      price,
      serviceType,
      image,
    });
    const service = await newService.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Update service
router.put("/:id", auth, admin, upload.single("image"), async (req, res) => {
  const { title, description, price, serviceType } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    const updatedFields = { title, description, price, serviceType };
    if (image) updatedFields.image = image;

    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Read services
router.get("/", async (req, res) => {
  const { search, sortBy, order, serviceType } = req.query;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (serviceType) {
      query.serviceType = serviceType;
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    const services = await Service.find(query)
      .populate("serviceType")
      .sort(sort);
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Read service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "serviceType"
    );
    if (!service) return res.status(404).json({ msg: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete service
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await Service.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ service: req.params.id });
    res.json({ msg: "Service and associated reviews removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
