'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  workreq: Object,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
