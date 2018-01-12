'use strict';

////////////////////////////////////////////////////////////
////////////////////  State Machine    ////////////////////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Stately =       require('stately.js');
const uuidv1 =        require('uuid/v1');
const clone =         require('clone-deep')

function reporter(event, oldState, newState) {

    var transition = oldState + ' => ' + newState;

    switch (newState) {
        /*
        ...
        case 'STOPPED => PLAYING':
        case 'PLAYING => PAUSED':
        ...
        */
        case 'PAUSED':
          console.log("-------------")
          console.log("fired off transaction")
        default:
            console.log(transition);
            break;
    }
}

var initialStateName = "STOPPED"

var statesObject = {

    'STOPPED': {
        onEnter: reporter,
        next: function (item) {
            console.log("OK THIS IS A BIG TEST")
            console.log(item)
            return this.PLAYING;
        }
    },
    'PLAYING': {
        onEnter: reporter,
        stop: function () {
            return this.STOPPED;
        },
        next: function () {
            return this.PAUSED;
        }
    },
    'PAUSED': {
        onEnter: reporter,
        play: function () {
            return this.PLAYING;
        },
        next: function () {
            return this.STOPPED;
        }
    }
};

var Example = require("../../exampleModel.js");

let cnt = 1000
let objMsg = {
  name: "ChaoticBot",
  number: cnt,
  email: "chaotic@gmail.com",
  boolean: true,
  array: [],
  date: undefined,
  message: "This is a testing process",
  state: ""
}

module.exports = function(router) {
    router.use(bodyParser.json());
      router.use(function(req, res, next) {
      let machine = new Stately(statesObject, initialStateName);
      console.log("-------------------- " + cnt)
      machine.next("this is a test")
      objMsg.number = cnt
      objMsg.state = machine.getMachineState()
      cnt++
      let priorCnt = cnt - 1
      let content = new Example(objMsg);
      console.log("-------DEBUG ------- ")
      console.log("PRIORCNT = " + priorCnt)
      console.log("-------------------")
      console.log("SAVING OBJECT " + objMsg.number)
      content.save(function(error, doc) {
        if (error) {
          res.send(error);
        }
        else {
          res.send(doc);

      // retrieve the object and the state that was recorded
      // so on the next tick it will progress to the next state for machine.next
      // this executes as part of callback above on the save
      Example.findOne({ 'name': 'ChaoticBot', 'number': priorCnt }, function (err, profile) {
        if (err) return handleError(err);
        if(profile) {
          console.log('%s %s has a state of %s.', profile.name, profile.number, profile.state)
          initialStateName = profile.state
          return
        }
        console.log("--------------------------")
        console.log("MONGO READ FOUND NO USER")
        console.log(profile)
        })

      }
    })

    })
  }
