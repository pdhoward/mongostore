
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ExampleSchema = new Schema({

  name: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  number: {
    type: Number,
    unique: true,
    required: true
  },
  email: {
    type: String,
    match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
  },
  boolean: Boolean,
  array: Array,
  date: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    validate: [
      function(input) {
        return input.length >= 6;
      },
      // Error Message
      "Longstring should be longer."
    ]
  },
  state: String
});

var Example = mongoose.model("Example", ExampleSchema);

module.exports = Example;
