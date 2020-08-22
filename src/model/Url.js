const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
