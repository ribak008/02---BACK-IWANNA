const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/ratingController");

router.post("/create-rating", ratingController.createRating);
router.get("/average/:id", ratingController.getAverageRating);
router.get("/check/:id", ratingController.getRating);

module.exports = router;
