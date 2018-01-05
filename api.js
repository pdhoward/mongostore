'use strict';

//////////////////////////////////////////////////////////////////////////
/////////////////     API Catalogue for db store   //////////////////////
/////////////////    server side 'in memory' db    //////////////////////
////////////////////////////////////////////////////////////////////////

const clone =     require('clone')
const uuidv1 =    require('uuid/v1');
const config =    require('./db/data/config')
const agents =    require('./db/data/agents')
const clients =   require('./db/data/members')
const context =   require('./db/data/context')

const dbMember = require('./api/members')
// unit test db stores
const db = {}
const agentDB = {}
const clientDB = {}
const contextDB = {}
const geoDB = {}
const profileDB = {}

// unit test data
const defaultData = {
  objStore: [
    {
      id: 'chatbot',
      name: 'Chatbot',
      email: 'chat@gmail.com',
      avatarURL: config.origin + '/chatbot.jpg'
    },
    {
      id: 'helpbot',
      name: 'Helpbot',
      email: 'help@gmail.com',
      avatarURL: config.origin + '/helpbot.jpg'
    },
    {
      id: 'smartbot',
      name: 'Smartbot',
      email: 'smart@gmail.com',
      avatarURL: config.origin + '/smartbot.jpg'
    }
  ]
}


///////////////////////////////////////////////////////
//////           verify test stores              /////
/////////////////////////////////////////////////////
const showagents = () => {
    return agents
}
const showclients = () => {
    return clients
}
const showcontext = () => {
   return context
}
const showpoints = () => {
   return geopoints
}
const showprofiles = () => {
   return profiles
}
///////////////////////////////////////////////////////
// standard db functions. Loads bot store on default//
/////////////////////////////////////////////////////
const get = (token) => {
  let data = clientDB[token]

  if (data == null) {
    data = clientDB[token] = clone(clients)
  }
  return data
}

const add = (token, contact) => {
  if (!contact.id) {
    contact.id = Math.random().toString(36).substr(-8)
  }
  get(token).push(contact)

  return contact
}

const remove = (token, id) => {
  const data = get(token)
  const contact = data.find(c => c.id === id)

  if (contact) {
    data.contacts = data.filter(c => c !== contact)
  }

  return { contact }
}


///////////////////////////////////
//////  agent db functions  //////
//////////////////////////////////
const getAgent = (token) => {
  let data = agentDB[token]

  if (data == null) {
    data = agentDB[token] = clone(agents)
  }

  return data
}

const addAgent = (token, contact) => {
  if (!contact.id) {
    contact.id = Math.random().toString(36).substr(-8)
  }

  getAgent(token).push(contact)

  return contact
}

const removeAgent = (token, id) => {
  const data = getAgent(token)
  const contact = data.objStore.find(c => c.id === id)

  if (contact) {
    data.contacts = data.objStore.filter(c => c !== contact)
  }

  return { contact }
}


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

const addClient = (token, contact) => {
  if (!contact.id) {
    contact.id = Math.random().toString(36).substr(-8)
  }
  getClient(token).push(contact)

  return contact
}

const removeClient = (token, id) => {
  let data = getClient(token)
  const contact = data.find(c => c.id === id)

  if (contact) {
    data = data.filter(c => c !== contact)
    clientDB[token] = clone(data)
  }
  return {contact}
}

/////////////////////////////////////
//////  context db functions  //////
//////////////////////////////////
const getContext = (token) => {
  let data = contextDB[token]

  if (data == null) {
    data = contextDB[token] = clone(context)
  }

  return data
}

const getOneContext = (token, session) => {
  let thisContext = {}
  let oneSession = getContext(token).find(c => {
    let obj1 = JSON.stringify(c.session)
    let obj2 = JSON.stringify(session)
    if (obj1 == obj2) {
      thisContext = Object.assign({}, c)
    }
  })
  return thisContext
}

const addContext = (token, context) => {
  if (!context.id) {
    context.id = Math.random().toString(36).substr(-8)
  }
  getContext(token).push(context)
  return context
}

const removeContext = (token, id) => {
  const data = getContext(token)
  const context = data.objStore.find(c => c.id === id)

  if (context) {
    data.contacts = data.objStore.filter(c => c !== context)
  }

  return { context }
}

/////////////////////////////////////
//////  profile db functions  //////
//////////////////////////////////

const addProfile = (token, profile) => {
  if (!profile.id) {
    profile.id = Math.random().toString(36).substr(-8)
  }
  addClient(token, profile)
  return profile
}


///////////////////////////////////////////////////////////
/////// REFACTOR CONNECT GET PROFILE TO MONGO ////////////
/////////////////////////////////////////////////////////
const getMembers = (token, cb) => {
  console.log("ENTERED getMembers")

  // need a model design - some kind of an org code
  let data = getClient(token)

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
  let data = getClient(token)

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
  let data = getClient(token)

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
  get,
  add,
  addMember,
  remove,
  showagents,
  showclients,
  showcontext,
  showpoints,
  getAgent,
  addAgent,
  removeAgent,
  getClient,
  getMembers,
  addClient,
  removeClient,
  getContext,
  getOneContext,
  addContext,
  removeContext,
  addProfile,
  updateProfile
}
