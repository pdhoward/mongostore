'use strict';

//////////////////////////////////////////////////////////////////////////
/////////////////     API Catalogue for db store   //////////////////////
/////////////////    server side 'in memory' db    //////////////////////
////////////////////////////////////////////////////////////////////////

const clone =     require('clone')
const uuidv1 =    require('uuid/v1');

const dbMember = require('./api/members')


////////////////////////////////////
//////  client db functions  //////
//////////////////////////////////
const getClient = (token) => {
  let data = clientDB[token]
  if (data == null) {
    data = clientDB[token] = clone(clients)
  }
  return data
}

///////////////////////////////////////////////////////////
/////// REFACTOR CONNECT GET PROFILE TO MONGO ////////////
/////////////////////////////////////////////////////////
const getMembers = (token, cb) => {
  console.log("ENTERED getMembers")

  // need a model design - some kind of an org code
  //let data = getClient(token)

  // async await function to drive synchronous processing of db update
  async function thread() {
    let result = await dbMember.get()
    return result
  }

  thread().then((result) => {
    cb(result)
  }).catch((err) => {
    console.log("ERROR IN Add Member PROCESSING")
    console.log(err)
  })
}


///////////////////////////////////////////////////////////
/////// REFACTOR CONNECT Update Profile in Mongo  ////////
/////////////////////////////////////////////////////////

const updateProfile = (token, contact, cb) => {

  // need a model design - some kind of an org code
  //let data = getClient(token)

  // async await function to drive synchronous processing of db update
  async function thread(data, contact) {
    let result = await updateRecord(data, contact)
    return result
  }

  thread(data, contact).then((profileArray) => {
    cb(profileArray)
  }).catch((err) => {
    console.log("ERROR IN updateProfile PROCESSING")
    console.log(err)
  })
}

function updateRecord(data, contact){
  return new Promise((resolve, reject) => {
    let newarr = data.map((c) => {
    if (c.id == contact.id) return contact
    return c
    })
    resolve(newarr)
  })
}
///////////////////////////////////////////////////
// REFACTOR - TEST MONGO INTEGRATION with CHAT WIDGET
/////////////////////////////////////////////////
const addMember = (token, contact, cb) => {

  console.log("ENTERED addMember")
  let param = {}
  param.subscribe = {}
  // set defaults
  param.subscribe.prayeralerts = false
  param.subscribe.updates = false
  param.subscribe.moments = false
  param.avatarURL = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y"
  param.email = "you@example.com"
  param.firstname = contact.name

  // need a model design - some kind of an org code
  //let data = getClient(token)

  // async await function to drive synchronous processing of db update
  async function thread(contact) {
    let result = await dbMember.put(param)
    return result
  }

  thread(contact).then((result) => {
    cb(result)
  }).catch((err) => {
    console.log("ERROR IN Add Member PROCESSING")
    console.log(err)
  })
}

module.exports = {
  addMember,
  getMembers,
  updateProfile
}
