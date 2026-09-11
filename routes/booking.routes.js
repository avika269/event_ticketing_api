const express = require("express");

const {
    bookTickets,
    getEventBookings,
    cancelBooking
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/events/:id/book", bookTickets);
router.get("/events/:id/bookings", getEventBookings);
router.delete("/:id", cancelBooking);

module.exports = router;