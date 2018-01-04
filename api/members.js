
'use strict';

//////////////////////////////////////////////////////////////////////////
///////////////////////////// Mongodb Functions /////////////////////////
////////////////////////////////////////////////////////////////////////
const Member =     require('../db/schemas/Member')

module.exports = {

  get: function({}, cb) {

   Member.find({}, function(err, response) {
      if (err) {
        if (err.error !== 'not_found') {
          return cb(err);
        } else {
          return cb(null);
        }};
      return cb(err, response);
    });

  },
/*
///////////
function updateRecord(data, contact){
  return new Promise((resolve, reject) => {
    let newarr = data.map((c) => {
    if (c.id == contact.id) return contact
    return c
    })
    resolve(newarr)
  })
}
////////// */
  put: function(params, cb) {

    let member = new Member(params);
    return new Promise((resolve, reject) => {
        member.save(function (err, response) {
          if (err) {
            console.log("Error When Saving Text Message")
            reject(err)
          }
          resolve(response)
    })
   })
  },

  update: function(params1, params2, params3, cb) {

    Member.findOneAndUpdate(params1, params2, params3, function (err, response) {
      if (err) {
        console.log(r("Error When Updating the Message Text"))
        return cb(err);
      }
      return cb(err, response);
    })
  }

  // fetch users ideas from db in the same geographic are as active user
  // note this search excludes the active user from the search results
/*
  fetch: function(params, callback) {

      botdb.find({ $and: [ {'context.longitude': {$eq: params.context.longitude} },
                           {'context.latitude': {$eq: params.context.latitude} },
                           {'userID': {$ne: params.user} } ] },
              function(err, results) {

                return callback(err, results);
              });


    }
*/
};
