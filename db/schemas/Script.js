'use strict';

const mongoose = require('mongoose');

const scriptSchema = mongoose.Schema({
  intent: String,
  id: String,
  script: String,
});

module.exports = mongoose.model('Script', scriptSchema);
