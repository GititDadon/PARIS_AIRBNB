const express = require("express");
const router = express.Router();

const hostsController = require("../controllers/hosts.controller");

router.get("/:hostId/listings", hostsController.getHostListings);

module.exports = router;