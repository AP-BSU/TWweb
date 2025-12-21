const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Analytics = require('../models/analyticsModel');

// --- 1. USER ROUTES ---
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const user = new User({ name: req.body.name, email: req.body.email });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- 2. TRACKING ROUTES ---
router.post('/track', async (req, res) => {
  try {
    const newEvent = new Analytics({ type: req.body.type, detail: req.body.detail });
    await newEvent.save();
    res.status(200).send('Tracked');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const feedbackData = JSON.stringify({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });

    const feedback = new Analytics({
      type: 'feedback',
      detail: feedbackData
    });
    
    await feedback.save();
    res.status(200).send('Feedback Received');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// --- 3. STATBOARD ROUTES ---

// GET: Full stats report (Counts for the top cards)
router.get('/stats', async (req, res) => {
  try {
    // 1. Count Unique Users
    const uniqueEmails = (await User.distinct('email')).length;
    const uniqueNames = (await User.distinct('name')).length;
    
    // 2. Count Analytics Events
    const visitCount = await Analytics.countDocuments({ type: 'visit' });
    const clickCount = await Analytics.countDocuments({ type: 'click' });
    const feedbackCount = await Analytics.countDocuments({ type: 'feedback' });

    res.json({
      online: true, 
      totalUsers: uniqueEmails, 
      uniqueNames: uniqueNames, 
      totalVisits: visitCount,
      totalClicks: clickCount,
      totalFeedbacks: feedbackCount
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feedback List (For StatBoard)
router.get('/feedback', async (req, res) => { //feedback'
    try {
        // 1. Get the raw analytics data
        const rawFeedbacks = await Analytics.find({ type: 'feedback' }).sort({ _id: -1 });
        
        // 2. "Unpack" the JSON string inside the 'detail' field
        const cleanFeedbacks = rawFeedbacks.map(item => {
            try {
                return JSON.parse(item.detail); // Turn string back into Object {name, email, message}
            } catch (e) {
                return null; // Skips if data is corrupted or interrupted
            }
        }).filter(item => item !== null);

        res.json(cleanFeedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;