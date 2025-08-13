const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity'],
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  promoters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  couponCodes: [{
    code: String,
    discount: Number,
    validUntil: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set available seats to capacity before saving
eventSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableSeats = this.capacity;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);