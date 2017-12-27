'use strict';

var mongoose = require('mongoose');

var scriptSchema = mongoose.Schema({
  intent: String,
  id: String,
  script: String,
});

module.exports = mongoose.model('Script', scriptSchema);
