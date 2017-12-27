'use strict';

///////////////////////////////////////////////////////////////////////
////////     intialize script array from test or db     //////////////
//////////////////////////////////////////////////////////////////////

const Script =              require('../schemas/Script')
const mongoose =            require('mongoose')
const testScripts =         require('../data/scripts')
const { g, b, gr, r, y } =  require('../../console')

module.exports.array = [];

module.exports.getScripts = function () {
      Script.find({}).exec(function (err, data){
        if (data.length === 0){
        module.exports.array = testScripts;
        console.log(g('Scripts initialized from file system '))
        return
      }
      else {
        module.exports.array = data;
        console.log(g('Scripts initialized from MongoDb '))
        return
      }
  })
}
