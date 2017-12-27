'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  user: String,
  context: Object,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Callback', messageSchema);
