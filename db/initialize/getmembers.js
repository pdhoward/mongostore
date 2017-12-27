'use strict';

const Member =              require('../schemas/Member')
const mongoose =            require('mongoose')
const testMembers =         require('../data/members')
const { g, b, gr, r, y } =  require('../../console')

const limit = 1;

function createDefaultMembers () {
      Member.find({}).limit(limit).exec(function (err, collection){
          if (collection.length === 0) {
            // iterate over the set of channels for initialization and create entries
            testMembers.map(function(member) {
                let newMember = new Member(member)
                newMember.save(function (err, data) {
                  if(err) {
                    console.log(err);
                    return res.status(500).json({msg: 'internal server error'});
                  }
                })
              })
            console.log(g('Test Members Initialized in MongoDB'))
            return
          }
          else {
            console.log(g('Members Exist in MongoDB'))
          }
        })
      }

module.exports = {
  createDefaultMembers: createDefaultMembers
}
