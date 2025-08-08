const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  wa_id: { type: String, required: true },
  name: String,
  from: String,
  message_id: { type: String, unique: true, required: true },
  text: String,
  type: String,
  timestamp: Number,
  status: String,
  status_timestamp: Number,
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
