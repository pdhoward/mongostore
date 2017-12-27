'use strict';

// Channel is the schema
import Member                     from '../schemas/Member';
import mongoose                   from 'mongoose';
import uuid                       from 'node-uuid';
import testMembers                from '../data/members';
import { g, b, gr, r, y }         from '../../color/chalk';

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
            console.log(g('Test Members Loaded'))
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
