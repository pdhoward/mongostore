'use strict';

///////////////////////////////////////////////////////////////////////
////////     intialize script array from test or db     //////////////
//////////////////////////////////////////////////////////////////////

const Script =              require('../schemas/Script')
const mongoose =            require('mongoose')
const uuid =                require('node-uuid')
const testMembers =         require('../data/members')
const { g, b, gr, r, y } =  require('../../color/chalk')
import Intent                      from '../schemas/Intent';
import mongoose                    from 'mongoose';
import uuid                        from 'node-uuid';
import configureIntents            from './config/intent';
import { g, b, gr, r, y }          from '../../color/chalk';

module.exports.array = [];

module.exports.getIntents = function () {
      Intent.find({}).exec(function (err, data){
        if (data.length === 0){
        module.exports.array = configureIntents;
        console.log(g('Intents initialized from db/initialize/testfaile '))
        return
      }
      else {
        module.exports.array = data;
        console.log(g('Intents initialized from Mongo '))
        return
      }
  })
}
