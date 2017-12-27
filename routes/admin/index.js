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
      console.log("admin message detected")
      console.log(req.headers)
      console.log(req.url)
      console.log(req.body)
      console.log(req.params)
      res.setHeader( 'Content-Range', 'agents 0-10/200')
      console.log(res.headers)
      res.send({message: "success"})
      console.log(res.getHeader('content-range'))
      console.log(res.getHeaders())
    })
  }
