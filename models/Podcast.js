const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  user: String,
  title: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Podcast', podcastSchema);
