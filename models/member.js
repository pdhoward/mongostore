
//////////////////////////////////////////////////////////////////////////
////////////////////    Uniform Response Schema     /////////////////////
////////////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')
const Schema = mongoose.Schema;

const memberObject = {
  message: Object,
  state: Object,
  classifier: Object,
  response: Object,
  bundle: Object,
  intent: Object,
  org: String,
  PostDate: { type: Date, default: Date.now },
  ChaoticSid: { type: String, default: uuidv1() }
}

const memberSchema = new Schema(memberObject);

let Interact = mongoose.model("Interact", interactSchema);

module.exports = { Interact, interactObject }
