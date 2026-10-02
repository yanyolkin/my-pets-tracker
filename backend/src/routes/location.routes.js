const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { trackerPayloadSchema } = require("../schemas/pet.schema");
const locationController = require("../controllers/location.controller");

router.post(
    "/tracker-data",
    validate(trackerPayloadSchema),
    locationController.receiveTrackerData,
);

router.get("/pets/:petId/history", protect, locationController.getPetHistory);

module.exports = router;
