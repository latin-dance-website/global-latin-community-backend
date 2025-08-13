const express = require('express');
const router = express.Router();
const {
  getUserBookings,
  createBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.get('/', protect, getUserBookings);
router.post('/', protect, createBooking);
router.get('/all', protect, authorize('admin'), getAllBookings);

module.exports = router;