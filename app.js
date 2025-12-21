require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
// For Vercel 'process.env.PORT', fallsback to 3000 locally
const port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB active'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// --- THE MAGIC LINE (Serves HTML/CSS/JS) ---
// This tells Express: "Serve ANY file found in the root folder automatically"
// This fixes your 'assets', 'index.html', and 'stats.js' paths instantly.
app.use(express.static(__dirname));

// --- ROUTES ---

// Dashboard Shortcut
app.get('/statboard', (req, res) => {
    // Redirects to the actual file location
    res.redirect('/statboard/statboard.html');
});

// Explicit Homepage Route (Optional, but good for safety)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Server Initiation
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// REQUIRED FOR VERCEL
module.exports = app;
