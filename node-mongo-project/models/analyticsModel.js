const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['visit', 'click', 'feedback'] // What kind of event is it?
  },
  detail: { 
    type: String, 
    default: 'general' // e.g., "Button: Get Started" or "Page Load"
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);