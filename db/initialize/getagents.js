'use strict';

///////////////////////////////////////////////////////////////////////
///////           placeholder fo loading agents              ////////
/////////////////////////////////////////////////////////////////////

const Agent  =              require('../schemas/Agent')
const mongoose =            require('mongoose')
const testAgents  =         require('../data/agents')
const { g, b, gr, r, y } =  require('../../console')

const limit = 1;

function getAgents () {
      Agent.find({}).limit(limit).exec(function (err, collection){
          if (collection.length === 0) {
            // iterate over the set of agents for initialization and create entries
            testAgents.map(function(agent) {
                let newAgent = new Agent(agent)
                newAgent.save(function (err, data) {
                  if(err) {
                    console.log(err);
                    return res.status(500).json({msg: 'internal server error'});
                  }
                })
              })
            console.log(g('Test Agents Initialized in MongoDB'))
            return
          }
          else {
            console.log(g('Agents Exist in MongoDB'))
          }
        })
      }

module.exports = {
  getAgents: getAgents
}
