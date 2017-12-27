'use strict';

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')

const memberSchema = mongoose.Schema({
  avatarURL: String,
  firstname: String,
  lastname: String,
  email: String,
  cell: String,
  subscribe: Object,
  postdate: { type: Date, default: Date.now },
  id: { type: String, default: uuidv1() }
})

module.exports = mongoose.model('Member', memberSchema);
