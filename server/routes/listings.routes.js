// Router for /api/listings - only paths -> controller functions (no logic, no SQL).
//
// Step 2: GET /      -> the cards (filters, sort, limit)
// Step 3: GET /:id   -> one place with host details
//

const express = require("express");
const router = express.Router();
const listingController= require("../controllers/listings.controller.js")

router.get('/',listingController.getListings);
router.get('/:id',listingController.getListingById)

module.exports = router;