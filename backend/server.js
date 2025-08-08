require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api', messageRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('WhatsApp Web Clone Backend is running');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
