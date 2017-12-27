'use strict';
/////////////////////////////////////////////////////
////////  		prototyping server             ///////
///////         xio labs v 1.2.0            ///////
//////////////////////////////////////////////////

const express =     require('express')
const bodyParser =  require('body-parser')
const cors =        require('cors')
const config =      require('./db/config')
const api =         require('./api')
const mongoose =    require("mongoose");
const bluebird =    require("bluebird");
const setup =       require('../config').init;
const app =  express();
//////////////////////////////////////////////////////////////////////////
////////////////// db config to capture messages   //////////////////////
////////////////////////////////////////////////////////////////////////

const db =          process.env.MONGODB_URI || setup.db.uri;
const host =        setup.SERVER.HOST;
const port =        setup.SERVER.PORT;

let options = {
  useMongoClient: true,
  poolSize: 10, // Maintain up to 10 socket connections
};
mongoose.Promise = bluebird;
mongoose.connect(db, options, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.error(error);
  }
  else {
    console.log("mongoose connection is successful");
    //////////////////////////////////////////////
    /////    drop and restore collection    /////
    ////////////////////////////////////////////
    require('../data')
    }
  });

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));
app.options('*', cors());
app.use(cors())

/////////////////////////////////////////////////////////////////////////////////////
/////////// Register and Config Routes for Admin Functions /////////////////////////
///////////////////////////////////////////////////////////////////////////////////

const adminRoute =     express.Router();
// route
require('./routes/admin')(adminRoute);

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  const help = `
  <pre>
    xio APIs test platform

    Use an Authorization header to work with your own data:
    fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})
    Endpoints vary by dbstore being modeled. Check the code for details

    &copy2016 xio all rights reserved
  </pre>
  `

  res.send(help)
})

// display content of various test db stores
app.get('/showagents', (req, res) => {
  res.send(api.showagents())
})
app.get('/showclients', (req, res) => {
  res.send(api.showclients())
})
app.get('/showpoints', (req, res) => {
  res.send(api.showpoints())
})
app.get('/showcontext', (req, res) => {
  res.send(api.showcontext())
})

// simple auth test
app.use((req, res, next) => {
  const token = req.get('Authorization')
  if (token) {
    req.token = token
    next()
  } else {
    console.log("Temp Workaround on Server Auth" )
    req.token = "123456"
    next()

  }
})


// administrative apis - membership management
app.use('/admin', adminRoute)

app.get('/api', (req, res) => {
  res.send(api.getClient(req.token))
})


app.delete('/api/:id', (req, res) => {
  res.send(api.removeClient(req.token, req.params.id))
})

app.post('/api', bodyParser.json(), (req, res) => {
  const { name, email } = req.body

  if (name && email) {
    res.send(api.add(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Please provide both a name and email address'
    })
  }
})

app.post('/api/profile', bodyParser.json(), (req, res) => {
  if (req.body) {
      res.send(api.addProfile(req.token, req.body))
    }
    else {
      res.status(403).send({
        error: 'Please provide all required data'
      })
    }
})

// notice the different pattern for handling async db update using await and cb
app.post('/api/updateprofile', bodyParser.json(), (req, res) => {
  if (req.body) {
        api.updateProfile(req.token, req.body, function(response){
          res.status(200).send(response)
      })
    }
    else {
      res.status(403).send({
        error: 'Please provide all required data'
      })
    }
})
// api modeling the primary platform data stores
app.get('/api/agent', (req, res) => {
  res.send(api.getAgent(req.token))
})

app.get('/api/agentarray', (req, res) => {
  res.send(api.getAgent(req.token))
})

app.get('/api/client', (req, res) => {
  res.send(api.getClient(req.token))
})
app.get('/api/context', (req, res) => {
  res.send(api.getContext(req.token))
})

app.get('/api/onecontext', bodyParser.json(), (req, res) => {
  console.log(JSON.stringify(req.query))
  const { session } = req.query
  res.send(api.getOneContext(req.token, session))
})

app.post('/api/context', bodyParser.json(), (req, res) => {
  const { session, nextAction, context } = req.body

  if ( session && nextAction && context) {
    res.send(api.addContext(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Please provide all required data'
    })
  }
})

// api modeling fetch of geojson data - simulating movement and geofencing
/*
// webpage
app.get('/api/geo', (req, res) => {
  res.sendFile(geoMap, { root: __dirname })
})
*/
//config data - mapbox
app.get('/api/geoconfig', bodyParser.json(), (req, res) => {
  res.send(api.getGeoConfig(req.token))
})
// geojson
app.get('/api/geopoints', bodyParser.json(), (req, res) => {
  res.send(api.getGeoData(req.token))
})


// spin up http server
app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})
