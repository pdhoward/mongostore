'use strict';

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')

const memberSchema = mongoose.Schema({
  message: Object,
  state: Object,
  classifier: Object,
  response: Object,
  bundle: Object,
  intent: Object,
  org: String,
  PostDate: { type: Date, default: Date.now },
  ChaoticSid: { type: String, default: uuidv1() }
})

module.exports = mongoose.model('Member', memberSchema)
