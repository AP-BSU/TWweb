const mongoose = require('mongoose');

// Structure
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// MongoDB Model and user collection for MongoDB
module.exports = mongoose.model('User', userSchema);