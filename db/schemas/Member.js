'use strict';

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')

const memberSchema = mongoose.Schema({
  avatarURL: {
    type: String
    default: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y"
    },
  firstname: String,
  lastname: String,
  email: {
    type: String,
    default: "you@example.com"
    match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
  },
  cell: String,
  subscribe: Object,
  postdate: { type: Date, default: Date.now },
  id: { type: String, default: uuidv1() }
})

module.exports = mongoose.model('Member', memberSchema);
