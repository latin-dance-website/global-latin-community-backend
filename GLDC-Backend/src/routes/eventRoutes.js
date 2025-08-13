const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEventPrice,
  generateCoupon,
  assignPromoter,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');

router.get('/', getEvents);
router.post('/', protect, authorize('organizer'), createEvent);
router.put('/:id/price', protect, authorize('promoter'), updateEventPrice);
router.post('/:id/coupon', protect, authorize('promoter'), generateCoupon);
router.post('/:id/promoters', protect, authorize('organizer'), assignPromoter);

module.exports = router;