'use strict';
/////////////////////////////////////////////////////
////////  		prototyping server             ///////
///////         xio labs v 1.2.0            ///////
//////////////////////////////////////////////////

const express =     require('express')
const bodyParser =  require('body-parser')
const cors =        require('cors')
const api =         require('./api')
const setup =       require('./config').init();
const transport =   require('./setup/gmail')

const app =  express();
//const host =        setup.SERVER.HOST;
const port =        setup.port;

//////////////////////////////////////////////////////////////////////////
////////////////// db config to capture messages   //////////////////////
////////////////////////////////////////////////////////////////////////
const db = process.env.MONGODB_URI || setup.db.uri;
require('./db/mongoose')(db);

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));
app.options('*', cors());
app.use(cors())

///////////////////////////////////////////////////////////////////////
/////////////////// messaging alert for platform errors ///////////////
//////////////////////////////////////////////////////////////////////

const mailObject = {
  from: '"ChaoticBots 👥" <chaoticbotshelp@gmail.com>',
  to: 'patrick.howard@hotmail.com',
  subject: 'Platform Error',
  text: ''
}
process.on('uncaughtException', function (er) {
    console.error(er.stack)
    mailObject.text = er.stack;
    transport.sendMail(mailObject, function (er) {
       if (er) console.error(er)
       process.exit(1)
    })
  })


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

//  TEST CHAT

app.post('/chat', (req, res) => {
  console.log("this worked")
  console.log(req.body)
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
app.listen(port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', port)
})
