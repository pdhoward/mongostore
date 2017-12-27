'use strict';

///////////////////////////////////////////////////////////////////////
////////              CHAOTIC BOTS MACHINE LEARNING           ////////
//////// intialize classifier array from local config or db  /////////
//////// Permits Lightweight training for rapid deployment   /////////
///////                      c 2017 xio                      ////////
/////////////////////////////////////////////////////////////////////
require( 'dotenv' ).config( {silent: true} );

import natural                     from 'natural';
import uuid                        from 'node-uuid';
import configureClassifications    from './config/intent';
import Classifications             from '../schemas/Intent';
import { g, b, gr, r, y }          from '../../color/chalk';

var fileId = process.env.CHAOTIC_CLIENT_ID + '.json';
var classArray = [];
const classifier = new natural.BayesClassifier();

function mapdata(cb){
  classArray = configureClassifications;
  classArray.map(function(document){
    classifier.addDocument(document.script, document.intent);
      })
  console.log("Mapping Completed")
  cb()
}

function traindata(cb) {
  classifier.train();
  console.log("Training Completed")
  cb()
}

// trained ML saved to local storage
function savedata(parm, cb) {
  classifier.save(parm, function(err, classifier) {
  console.log('Saving Completed')
  cb()
  });
}

// Trained ML data exported for use by handlers and microservices
function loaddata(parm, cb) {
  natural.BayesClassifier.load(parm, null, function(err, classifier) {
      console.log('Export Completed')
      module.exports.classifier = classifier;
      return cb()
  });
}

module.exports.getClassifications = function () {
      Classifications.find({}).exec(function (err, data){
        if (data.length === 0){
            mapdata(function(){
              traindata(function(){
                var parm = fileId;
                savedata(parm, function(){
                  loaddata(parm, function(){
                    return
                  })
                })
              })
            })
          }
          else {
            data.map(function(document){
              //classifier.addDocument(document.text, document.class);
              // need to extract client classifier  -- already trained
            })
            natural.BayesClassifier.load(fileId, null, function(err, classifier) {
                if (err) { console.log({err: err})}
                console.log(g('Classifier initialized from db '))
            });
          return
        }
      })
}
