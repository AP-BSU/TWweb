require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // <--- ADD THIS

const app = express();
const port = process.env.PORT || 3000;

// --- DEBUGGING BLOCK (Add this right here) ---
console.log('--- SERVER FILE CHECK ---');
console.log('Current Folder:', __dirname);
try {
    const rootFiles = fs.readdirSync(__dirname);
    console.log('Files in Root:', rootFiles);
    
    if (rootFiles.includes('assets')) {
        console.log('Assets folder found!');
        const assetFiles = fs.readdirSync(path.join(__dirname, 'assets'));
        console.log('Inside Assets:', assetFiles);
    } else {
        console.log('Assets folder is MISSING from Root!');
    }
} catch (error) {
    console.log('Debug Error:', error);
}
console.log('---------------------------');
// ---------------------------------------------

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB active'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// FORCE STATIC PATHS (Update this line)
app.use(express.static(path.join(__dirname))); 
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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

