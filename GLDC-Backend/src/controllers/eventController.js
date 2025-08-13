const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .populate('promoters', 'name email');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create event (Organizer only)
// @route   POST /api/events
// @access  Private/Organizer
exports.createEvent = async (req, res) => {
  try {
    req.body.organizer = req.user.id;
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update event price (Promoter only)
// @route   PUT /api/events/:id/price
// @access  Private/Promoter
exports.updateEventPrice = async (req, res) => {
  try {
    const { price } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Check if promoter is assigned to this event
    if (!event.promoters.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }
    
    event.price = price;
    await event.save();
    
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Generate coupon code (Promoter only)
// @route   POST /api/events/:id/coupon
// @access  Private/Promoter
exports.generateCoupon = async (req, res) => {
  try {
    const { code, discount, validUntil } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Check if promoter is assigned to this event
    if (!event.promoters.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create coupons for this event',
      });
    }
    
    event.couponCodes.push({
      code,
      discount,
      validUntil,
      createdBy: req.user.id,
    });
    
    await event.save();
    
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Assign promoter to event (Organizer only)
// @route   POST /api/events/:id/promoters
// @access  Private/Organizer
exports.assignPromoter = async (req, res) => {
  try {
    const { promoterId } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Check if user is the organizer of this event
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to assign promoters to this event',
      });
    }
    
    if (!event.promoters.includes(promoterId)) {
      event.promoters.push(promoterId);
      await event.save();
    }
    
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};