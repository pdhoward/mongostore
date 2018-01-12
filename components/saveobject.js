
var Example = require("../db/schemas/exampleModel.js");

let cnt = 1000
let objMsg = {
  name: "ChaoticBot",
  number: cnt,
  email: "chaotic@gmail.com",
  boolean: true,
  array: [],
  date: undefined,
  message: "This is a testing process",
  state: "DONOTKNOW"
}

exports.saveobject = (req, res, msg) => {
  objMsg.number = cnt
  //objMsg.state = machine.getMachineState()
  cnt++
  let content = new Example(objMsg);
  console.log("SAVING OBJECT " + objMsg.number)
  content.save(function(error, doc) {
    if (error) {
      res.send(error);
    }
    else {
      res.send(doc);
    }
  })
}
