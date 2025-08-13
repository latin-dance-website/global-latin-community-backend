const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date location price');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { eventId, tickets, couponCode } = req.body;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    if (event.availableSeats < tickets) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available',
      });
    }
    
    let totalPrice = event.price * tickets;
    let discount = 0;
    
    // Apply coupon if provided
    if (couponCode) {
      const coupon = event.couponCodes.find(c => 
        c.code === couponCode && new Date(c.validUntil) > new Date()
      );
      
      if (coupon) {
        discount = coupon.discount;
        totalPrice = totalPrice * (1 - discount / 100);
      }
    }
    
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      tickets,
      totalPrice,
      couponCode,
      discount,
    });
    
    // Update available seats
    event.availableSeats -= tickets;
    await event.save();
    
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date location');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};