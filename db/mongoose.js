'use strict';


///////////////////////////////////////////////////////////////////////
////////   connect to our document store and initialize //////////////
///////    channels - test path    intents - topic id   //////////////
///////    classifier - npm natural topic id            //////////////
//////////////////////////////////////////////////////////////////////


import mongoose                   from 'mongoose';
import initializeChannels         from './initialize/getchannels';
import initializeIntents          from './initialize/getintents';
import initializeClassifier       from './initialize/getclassifications';
import { g, b, gr, r, y }         from '../color/chalk';

module.exports = function (dbURI) {
    mongoose.connect(dbURI);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, r('connection error...')));
    db.once('open', function callback() {
        initializeChannels.createDefaultChannel();
        initializeIntents.getIntents();
        initializeClassifier.getClassifications();
        console.log(g('MongoDB Connected'));
    });
};

-------------------


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
