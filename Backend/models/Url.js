const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  shortid: {
    type: String,
    required: true
  }
});

const ShortUrl = mongoose.model('shortUrl', urlSchema);

module.exports = ShortUrl