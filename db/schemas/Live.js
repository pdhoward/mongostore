'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  agentone: String,
  agenttwo: String,
  redirect: {
    agent: String,
    intent: String,
    sender: String,
    receiver: String,
    count: Number
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Live', messageSchema);
