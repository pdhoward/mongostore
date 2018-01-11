'use strict';

////////////////////////////////////////////////////////////
//////       Microservice Interaction Engine           ////
/////             c2016 XIO. Patent Pending           ////
////                administrative apis              ////
/////////////////////////////////////////////////////////

const bodyParser =    require('body-parser')
const uuidv1 =        require('uuid/v1');

module.exports = function(router) {
    router.use(bodyParser.json());

      router.use(function(req, res, next) {
      res.setHeader( 'Content-Range', 'agents 0-10/200')
      res.send({message: "success"})    
    })
  }
