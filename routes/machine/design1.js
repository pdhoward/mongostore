'use strict';

////////////////////////////////////////////////////////////
////////////////////  State Machine    ////////////////////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const Stately =       require('stately.js');
const uuidv1 =        require('uuid/v1');
const clone =         require('clone-deep')
const dialogues =      require('../../dialogues')

var initialStateName = "START"

let machine = new Stately(dialogues.notify, initialStateName);

module.exports = function(router) {
    router.use(bodyParser.json());
      router.use(function(req, res, next) {
          console.log("-------------------- ")
          let msg = {message: "Hello Wonderful Components"}
          machine.next(req, res, msg)
      })
    }
